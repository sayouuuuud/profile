import { NextRequest, NextResponse } from 'next/server';
import { parseWithRetry } from '@/lib/gemini';
import { analyzeGithubRepo } from '@/lib/github';

interface ParseRequest {
  input: string;
  source: 'text' | 'voice' | 'github';
}

interface ParseResponse {
  success: boolean;
  data?: {
    title: string;
    description: string;
    technologies: string[];
    kpis: { [key: string]: number | string };
    github_url?: string;
    confidence: number;
  };
  error?: string;
  message?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ParseResponse>> {
  try {
    const body = await request.json() as ParseRequest;
    const { input, source } = body;

    if (!input || !source) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: input, source' },
        { status: 400 }
      );
    }

    // Validate source
    if (!['text', 'voice', 'github'].includes(source)) {
      return NextResponse.json(
        { success: false, error: 'Invalid source. Must be: text, voice, or github' },
        { status: 400 }
      );
    }

    console.log(`[Parser] Processing ${source} input: ${input.substring(0, 50)}...`);

    let parseInput = input;
    let githubUrl: string | undefined;

    // Handle GitHub URL
    if (source === 'github') {
      try {
        const analysis = await analyzeGithubRepo(input);
        githubUrl = analysis.url;

        // Create text description from GitHub analysis
        parseInput = `
GitHub Repository Analysis:
- Name: ${analysis.repo}
- Owner: ${analysis.owner}
- Description: ${analysis.description}
- Stars: ${analysis.stars}
- Primary Language: ${analysis.language}
- Languages: ${Object.keys(analysis.languages).join(', ')}
- Topics: ${analysis.topics.join(', ')}
- Technologies Detected: ${analysis.technologies.join(', ')}
        `.trim();
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Failed to analyze GitHub repository: ${error instanceof Error ? error.message : 'Unknown error'}` 
          },
          { status: 400 }
        );
      }
    }

    // Parse the input
    const parsed = await parseWithRetry(parseInput);

    if (!parsed) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse project data' },
        { status: 500 }
      );
    }

    // Add GitHub URL if available
    if (githubUrl) {
      parsed.github_url = githubUrl;
    }

    return NextResponse.json(
      {
        success: true,
        data: parsed,
        message: `Successfully parsed project: ${parsed.title}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Parser API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Parser error: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<ParseResponse>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST to parse projects.',
    },
    { status: 405 }
  );
}
