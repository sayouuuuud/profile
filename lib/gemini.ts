import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback to env if DB config fails or is missing
const GEN_AI_KEY = process.env.GEMINI_API_KEY;

if (!GEN_AI_KEY) {
  console.warn("Missing GEMINI_API_KEY environment variable. AI features may fail if not configured in DB.");
}

/**
 * Get a Supabase client that works in both interactive (admin pages) and
 * headless (cron jobs, webhook) contexts.
 * Tries the cookie-based server client first, falls back to service-role client.
 */
async function getSupabaseClient() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const client = await createClient();
    // Test the client works (will throw if no session/cookies context)
    await client.from("system_config").select("id").limit(1);
    return client;
  } catch {
    // Fallback to service role client (works in cron/webhook contexts)
    const { createClient: createServiceClient } = await import("@/lib/supabase/service");
    return createServiceClient();
  }
}

async function getSystemConfig(category: string, key: string, defaultValue: any) {
  try {
    const supabase = await getSupabaseClient();
    const { data } = await supabase
      .from("system_config")
      .select("value")
      .eq("category", category)
      .eq("key", key)
      .single();
    return data?.value ?? defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

async function logUsage(metric: string, value: number, metadata: any = {}) {
  try {
    const supabase = await getSupabaseClient();
    await supabase.from("usage_stats").insert({
      category: "ai",
      metric,
      value,
      metadata
    });
  } catch (e) {
    console.error("Failed to log AI usage:", e);
  }
}

export interface ParsedProjectData {
  title: string;
  description: string;
  technologies: string[];
  kpis: Record<string, string | number>;
  confidence: number;
}

export async function parseProjectInput(input: string, source: "text" | "github" | "voice"): Promise<ParsedProjectData> {
  // FORCE OVERRIDE: Using 'gemini-flash-latest' which is explicitly in the allowed list (Step 1112).
  const modelId = "gemini-flash-latest";
  const apiKey = await getSystemConfig("ai", "api_key", GEN_AI_KEY); // Allow overriding key from DB

  console.log(`[Gemini] Initializing with Model: ${modelId} | Key Preview: ${apiKey ? apiKey.substring(0, 5) + '...' : 'NONE'}`);

  if (!apiKey) throw new Error("No API Key configured for AI");

  const genAI = new GoogleGenerativeAI(apiKey);
  // Note: If gemini-pro fails, try 'gemini-pro-latest' which was seen in the API list.
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
    You are an expert technical project analyzer. Your task is to extract structured project data from the provided input.
    
    Input Source: ${source}
    Input Data: "${input}"
    
    Extract the following information in strict JSON format:
    {
      "title": "Project Name",
      "description": "A concise 2-3 sentence technical description.",
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "kpis": {
        "metric_name": "value" (e.g., "users": "10k", "uptime": "99.9%")
      },
      "confidence": 85 (A number between 0-100 indicating confidence in extraction)
    }

    Rules:
    - If a specific field cannot be found, make a reasonable inference or leave it as null/empty.
    - Title should be catchy but professional.
    - Technologies should be normalized (e.g., "ReactJS" -> "React").
    - Do NOT wrap the output in markdown code blocks. Return raw JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log Usage
    const inputTokens = Math.ceil(prompt.length / 4); // Estimation
    const outputTokens = Math.ceil(text.length / 4);
    await logUsage("tokens_input", inputTokens, { source, operation: "parse" });
    await logUsage("tokens_output", outputTokens, { source, operation: "parse" });
    await logUsage("requests_success", 1, { source, operation: "parse" });

    // Clean up potential markdown wrapping
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    await logUsage("requests_failed", 1, { source, operation: "parse", error: String(error) });
    throw new Error("Failed to parse project data via AI");
  }
}

export async function analyzeProjectDocs(docs: string, query: string): Promise<string> {
  const modelId = "gemini-flash-latest"; // Force available model
  const apiKey = await getSystemConfig("ai", "api_key", GEN_AI_KEY);

  if (!apiKey) throw new Error("No API Key configured for AI");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
    Analyze the following technical documentation (README/Architecture doc):
    
    "${docs.substring(0, 10000)}" // Truncate to avoid context limits if necessary
    
    Query: ${query}
    
    Provide a detailed, technical answer based strictly on the provided context.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log Usage
    const inputTokens = Math.ceil(prompt.length / 4);
    const outputTokens = Math.ceil(text.length / 4);
    await logUsage("tokens_input", inputTokens, { operation: "analyze" });
    await logUsage("tokens_output", outputTokens, { operation: "analyze" });
    await logUsage("requests_success", 1, { operation: "analyze" });

    return text;
  } catch (error) {
    console.error("Gemini Analyze Error:", error);
    await logUsage("requests_failed", 1, { operation: "analyze", error: String(error) });
    return "Failed to analyze documentation.";
  }
}

export async function generateBriefInsights(analytics: any, extraContext: string = ""): Promise<any> {
  const modelId = "gemini-flash-latest"; // Force available model
  const apiKey = await getSystemConfig("ai", "api_key", GEN_AI_KEY);

  if (!apiKey) throw new Error("No API Key configured for AI");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
    You are a specialized "Morning Brief" generator for a Product Manager's portfolio.
    Analyze the following website analytics from the last 24 hours:
    ${JSON.stringify(analytics, null, 2)}

    ${extraContext}

    Generate a JSON response with:
    - summary: A 1-sentence executive summary of the day's performance. Matches the requested tone.
    - insights: 3 bullet points highlighting key trends or anomalies.
    - action_items: 1-2 suggested actions (e.g., "Promote the Case Study on LinkedIn").
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log Usage
    const inputTokens = Math.ceil(prompt.length / 4);
    const outputTokens = Math.ceil(text.length / 4);
    await logUsage("tokens_input", inputTokens, { operation: "brief" });
    await logUsage("tokens_output", outputTokens, { operation: "brief" });
    await logUsage("requests_success", 1, { operation: "brief" });

    // Clean up potential markdown wrapping
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Brief Error:", error);
    await logUsage("requests_failed", 1, { operation: "brief", error: String(error) });
    return {
      summary: "Failed to generate AI brief.",
      insights: ["Check system logs."],
      action_items: []
    };
  }
}
