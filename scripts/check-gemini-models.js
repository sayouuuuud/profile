const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No GEMINI_API_KEY found in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-1.5-flash-latest"
        ];

        console.log(`Testing models with key ending in... ${key.slice(-5)}`);

        for (const modelId of candidates) {
            process.stdout.write(`Testing ${modelId}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelId });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log("✅ SUCCESS");
                break; // Stop after first success
            } catch (e) {
                console.log("\n❌ FAILED");
                console.log("   Message:", e.message);
                // Log full error details if available
                if (e.response) {
                    console.log("   Status:", e.response.status);
                    console.log("   StatusText:", e.response.statusText);
                }
                if (e.errorDetails) {
                    console.log("   Details:", JSON.stringify(e.errorDetails));
                }
            }
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
