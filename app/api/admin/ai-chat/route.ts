import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();

        // fetch config
        const supabase = await createClient();
        const { data } = await supabase.from("system_config").select("value").eq("category", "ai").eq("key", "gemini_api_key").single();
        const apiKey = data?.value || process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "No API Key configured." }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);
        
        const systemInstruction = `
أنت الذكاء الاصطناعي المسؤول عن استخراج بيانات المشاريع وتحويلها لـ Case Studies.
مدير النظام (Admin) يتحدث معك الآن لمناقشة ملاحظاتك واقتراحاتك التي قدمتها سابقاً حول أحد المشاريع.
المشروع الذي تناقشانه: ${context.project_title}
ملاحظاتك السابقة:
${context.feedback?.map((f: string) => "- " + f).join("\n")}

يجب أن تتحدث بالعربية بأسلوب مهني متعاون كمهندس ذكاء اصطناعي.
الهدف هو مساعدة الإدارة في فهم سبب هذه الملاحظات أو اقتراح كيف يمكن تحسين النظام (Schema) لتسهيل عملك.
لا تختلق أشياء لم تقلها. إذا سألك لماذا كتبت ذلك، اشرح المشكلة التي واجهتك.
`;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction,
            generationConfig: {
                temperature: 0.7
            }
        });

        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({ history });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        
        return NextResponse.json({ response: result.response.text() });

    } catch (e: any) {
        console.error("AI Chat Error:", e);
        return NextResponse.json({ error: "Failed to generate response", details: e.message }, { status: 500 });
    }
}
