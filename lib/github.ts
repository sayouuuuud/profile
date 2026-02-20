import { Octokit } from "octokit";

if (!process.env.GITHUB_TOKEN) {
  console.warn("Missing GITHUB_TOKEN environment variable. GitHub data fetching may be limited.");
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export interface GitHubRepoData {
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
  languages: Record<string, number>;
  topContributors: string[];
  description?: string;
}

export async function getGitHubRepoData(owner: string, repo: string): Promise<GitHubRepoData | null> {
  try {
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const { data: languages } = await octokit.rest.repos.listLanguages({ owner, repo });
    const { data: contributors } = await octokit.rest.repos.listContributors({ owner, repo, per_page: 5 });


    return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      lastUpdate: repoData.updated_at,
      languages,
      topContributors: contributors.map((c) => c.login ?? "Anonymous"),
      description: repoData.description ?? "",
    };
  } catch (error) {
    console.error("GitHub API Error:", error);
    return null;
  }
}

export async function getRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: "raw",
      },
    });
    return String(data);
  } catch (error) {
    console.error("GitHub Readme API Error:", error);
    // Fallback to raw content for public repos
    try {
      const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`);
      if (rawRes.ok) return await rawRes.text();
      const rawResMaster = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
      if (rawResMaster.ok) return await rawResMaster.text();
      const rawResMain = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
      if (rawResMain.ok) return await rawResMain.text();
    } catch (e) {
      console.error("GitHub Raw Fallback Error:", e);
    }
    return null;
  }
}

export async function getRepoStructure(owner: string, repo: string): Promise<string[]> {
  try {
    // Get the default branch first
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;

    const { data } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: "true"
    });

    // Limits the output to avoid token limits. Prioritize root files and important configs.
    // Filter to include only file paths, up to 50 items to keep context manageable
    return data.tree
      .filter((item) => item.type === "blob")
      .map((item) => item.path || "")
      .filter((path) => {
        // Include root files
        if (!path.includes("/")) return true;
        // Include likely config files in subdirectories
        if (path.match(/(package\.json|requirements\.txt|Dockerfile|docker-compose\.yml|\.env\.example|tsconfig\.json|next\.config\.js|vite\.config\.ts|cargo\.toml|go\.mod)/i)) return true;
        // Include src/app structure hint
        if (path.startsWith("src/") && path.split("/").length < 4) return true;
        return false;
      })
      .slice(0, 100);

  } catch (error) {
    console.error("GitHub Structure Error:", error);
    return [];
  }
}
