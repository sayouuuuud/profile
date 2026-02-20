import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParsedProject {
  title: string;
  description: string;
  technologies: string[];
  kpis: { [key: string]: number | string };
  github_url?: string;
  confidence: number;
}

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `أنت مساعد ذكي متخصص في استخراج بيانات المشاريع التقنية من نصوص مختلفة.

مهمتك: من النص التالي، استخرج المعلومات بصيغة JSON فقط (بدون أي نص إضافي أو شرح):

{
  "title": "اسم المشروع الدقيق",
  "description": "وصف مختصر في 2-3 جمل توضح ما يفعله المشروع",
  "technologies": ["تقنية1", "تقنية2", "تقنية3"],
  "kpis": {
    "downloads": 0,
    "users": 0,
    "revenue": 0,
    "stars": 0,
    "contributors": 0
  },
  "github_url": "رابط GitHub إن وجد",
  "confidence": 85
}

ملاحظات مهمة:
1. استخرج فقط الأرقام الحقيقية من النص - إذا لم تجد معلومة محددة، ضع null أو 0
2. التقنيات يجب أن تكون أسماء دقيقة (مثل: React, Node.js, PostgreSQL, Docker)
3. confidence يعكس مدى ثقتك (0-100) في دقة البيانات المستخرجة
4. إذا كان النص واضحاً وكامل المعلومات، confidence يجب أن تكون عالية (80-100)
5. لا تضيف أي نص قبل أو بعد JSON - JSON فقط`;

export async function parseProjectInput(input: string): Promise<ParsedProject | null> {
  if (!input.trim()) {
    throw new Error('Input text is empty');
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nالنص المراد تحليله:\n${input}` }]
      }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedProject;
    
    // Validate required fields
    if (!parsed.title || !parsed.description) {
      throw new Error('Missing required fields in parsed data');
    }

    return parsed;
  } catch (error) {
    console.error('[Gemini] Parse error:', error);
    throw error;
  }
}

export async function parseWithRetry(
  input: string,
  maxRetries: number = 3
): Promise<ParsedProject | null> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await parseProjectInput(input);
    } catch (error) {
      lastError = error as Error;
      console.warn(`[Gemini] Attempt ${i + 1}/${maxRetries} failed:`, lastError.message);
      
      // Wait before retry (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError || new Error('Failed to parse project after multiple retries');
}

export async function analyzeProjectForInterview(projectData: ParsedProject): Promise<string[]> {
  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `أنت خبير في إجراء المقابلات التقنية. بناءً على بيانات المشروع التالية، اقترح 5 أسئلة ذكية وموجهة لمؤسس المشروع:

المشروع: ${projectData.title}
الوصف: ${projectData.description}
التقنيات: ${projectData.technologies.join(', ')}

أرسل الأسئلة كـ JSON array فقط:
[
  { "category": "architecture", "question": "السؤال هنا" },
  { "category": "performance", "question": "السؤال هنا" },
  ...
]

الفئات الممكنة: architecture, performance, security, growth, ux`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      return [
        "What were the main technical challenges you faced?",
        "How did you approach scalability?",
        "What would you do differently?",
        "Who is your target user?",
        "What's your go-to-market strategy?",
      ];
    }

    const questions = JSON.parse(jsonMatch[0]);
    return questions.map((q: any) => q.question);
  } catch (error) {
    console.error('[Gemini] Interview analysis error:', error);
    // Return default questions on error
    return [
      "What were the main technical challenges you faced?",
      "How did you approach scalability?",
      "What would you do differently?",
      "Who is your target user?",
      "What's your go-to-market strategy?",
    ];
  }
}
