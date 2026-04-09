import { NextRequest, NextResponse } from "next/server";
import { getRepoReadme, getRepoStructure, getGitHubRepoData } from "@/lib/github";
import { parseProjectInput } from "@/lib/groq";
import { createClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
    try {
        const { repoUrl, manualContext } = await req.json();

        if (!repoUrl) {
            return NextResponse.json({ error: "Missing repoUrl" }, { status: 400 });
        }

        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
        }

        const [_, owner, repo] = match;

        // 1. Fetch Repository Metadata (Stars, Description, etc.)
        const repoData = await getGitHubRepoData(owner, repo);
        if (!repoData) {
            return NextResponse.json(
                { error: "Repository not found or private" },
                { status: 404 }
            );
        }

        // 2. Fetch README (Attempt)
        let readme = await getRepoReadme(owner, repo);

        // 3. Fetch Structure (if README is missing or just to augment)
        let structure: string[] = [];
        if (!readme) {
            structure = await getRepoStructure(owner, repo);
        }

        // Prepare context for AI
        let aiInput = `Repository: ${owner}/${repo}\n`;
        aiInput += `Description: ${repoData.description || "No description provided."}\n`;
        aiInput += `Languages: ${Object.keys(repoData.languages).join(", ")}\n`;

        if (readme) {
            aiInput += `\nREADME Content:\n${readme.substring(0, 8000)}`; // Truncate to avoid context limits
        } else if (structure.length > 0) {
            aiInput += `\nUse the following File Structure to infer the project type and architecture:\n${structure.join("\n")}`;
        } else {
            aiInput += `\nNo README or file structure available. Infer details from the description and languages.`;
        }

        // 4. Analyze with Groq (Using the robust parseProjectInput function)
        // We use "github" as source to trigger specific prompt optimizations if any
        const analysis = await parseProjectInput(aiInput, "github", manualContext);
        
        if (!analysis.subtitle || analysis.subtitle === "No description provided." || analysis.subtitle === "No description found") {
            analysis.subtitle = analysis.summary?.split(".")[0] || analysis.title;
        }
        // Only add GitHub stats if they are genuinely impressive
        if (analysis.metrics.length < 4 && repoData.stars > 10) {
            analysis.metrics.push({ label: "GITHUB STARS", value: `${repoData.stars.toLocaleString()}+` });
        }
        if (analysis.metrics.length < 4 && repoData.forks > 5) {
            analysis.metrics.push({ label: "COMMUNITY FORKS", value: `${repoData.forks.toLocaleString()}+` });
        }
        // Hard cap at 4 metrics — the AI constitution mandates exactly 4
        analysis.metrics = analysis.metrics.slice(0, 4);

        // Ensure technologies include the real languages detected
        const detectedLangs = Object.keys(repoData.languages);
        analysis.technologies = Array.from(new Set([...analysis.technologies, ...detectedLangs]));

        return NextResponse.json({ success: true, analysis });

    } catch (error: any) {
        console.error("Analyze GitHub Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
