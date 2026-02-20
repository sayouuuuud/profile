
import { NextResponse } from "next/server";
import { parseProjectInput } from "@/lib/groq"; // Switched to Groq
import { createClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  try {
const { input, source, manualContext } = await req.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    // Call Groq (Llama 3)
let data = await parseProjectInput(input, source, manualContext || "");

    // Enrich with GitHub data if source is GitHub or a GitHub URL is detected
    if (source === "github" || input.includes("github.com")) {
      // Extract owner and repo from URL
      const match = input.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [_, owner, repo] = match;
        // Import dynamically to avoid circular dependency issues if any, or just standard import usage
        const { getGitHubRepoData } = await import("@/lib/github");
        const githubData = await getGitHubRepoData(owner, repo);

        if (githubData) {
          data = {
            ...data,
            metrics: [
              ...data.metrics,
              { label: "Stars", value: String(githubData.stars) },
              { label: "Forks", value: String(githubData.forks) },
              { label: "Open Issues", value: String(githubData.openIssues) },
            ],
            technologies: [...new Set([...data.technologies, ...Object.keys(githubData.languages)])],
          };
        }
      }
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Project Parse API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
