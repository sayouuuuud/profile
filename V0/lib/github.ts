interface GithubRepoAnalysis {
  owner: string;
  repo: string;
  description: string;
  stars: number;
  language: string;
  languages: { [key: string]: number };
  topics: string[];
  technologies: string[];
  hasPackageJson: boolean;
  hasRequirementsTxt: boolean;
  hasComposerJson: boolean;
  hasPubspec: boolean;
  isPrivate: boolean;
  url: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

function parseGithubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  return { owner: match[1], repo: match[2] };
}

async function checkFileExists(owner: string, repo: string, path: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error(`[GitHub] Error checking ${path}:`, error);
    return false;
  }
}

async function getLanguages(owner: string, repo: string): Promise<{ [key: string]: number }> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    if (!response.ok) return {};
    return await response.json();
  } catch (error) {
    console.error(`[GitHub] Error fetching languages:`, error);
    return {};
  }
}

function detectTechnologies(
  languages: { [key: string]: number },
  topics: string[],
  filePresence: { [key: string]: boolean }
): string[] {
  const techs = new Set<string>();

  // Add from languages
  Object.keys(languages).forEach(lang => {
    const normalized = lang.toLowerCase();
    if (normalized.includes('typescript')) techs.add('TypeScript');
    if (normalized.includes('javascript')) techs.add('JavaScript');
    if (normalized === 'python') techs.add('Python');
    if (normalized === 'java') techs.add('Java');
    if (normalized === 'go') techs.add('Go');
    if (normalized === 'rust') techs.add('Rust');
    if (normalized === 'php') techs.add('PHP');
    if (normalized === 'swift') techs.add('Swift');
    if (normalized === 'kotlin') techs.add('Kotlin');
  });

  // Add from file presence
  if (filePresence['package.json']) techs.add('Node.js');
  if (filePresence['requirements.txt']) techs.add('Python');
  if (filePresence['composer.json']) techs.add('PHP');
  if (filePresence['pubspec.yaml']) techs.add('Dart/Flutter');

  // Add from topics
  topics.forEach(topic => {
    const normalized = topic.toLowerCase();
    const mapping: { [key: string]: string } = {
      'react': 'React',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'nextjs': 'Next.js',
      'express': 'Express.js',
      'django': 'Django',
      'flask': 'Flask',
      'postgresql': 'PostgreSQL',
      'mongodb': 'MongoDB',
      'redis': 'Redis',
      'docker': 'Docker',
      'kubernetes': 'Kubernetes',
      'graphql': 'GraphQL',
      'restapi': 'REST API',
    };

    Object.entries(mapping).forEach(([key, value]) => {
      if (normalized.includes(key)) techs.add(value);
    });
  });

  return Array.from(techs);
}

export async function analyzeGithubRepo(url: string): Promise<GithubRepoAnalysis> {
  const { owner, repo } = parseGithubUrl(url);

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Repository not found or access denied: ${response.status}`);
    }

    const data = await response.json() as any;

    // Check file existence in parallel
    const [hasPackageJson, hasRequirementsTxt, hasComposerJson, hasPubspec] = await Promise.all([
      checkFileExists(owner, repo, 'package.json'),
      checkFileExists(owner, repo, 'requirements.txt'),
      checkFileExists(owner, repo, 'composer.json'),
      checkFileExists(owner, repo, 'pubspec.yaml'),
    ]);

    // Get languages
    const languages = await getLanguages(owner, repo);

    // Detect technologies
    const technologies = detectTechnologies(languages, data.topics || [], {
      'package.json': hasPackageJson,
      'requirements.txt': hasRequirementsTxt,
      'composer.json': hasComposerJson,
      'pubspec.yaml': hasPubspec,
    });

    return {
      owner,
      repo,
      description: data.description || '',
      stars: data.stargazers_count || 0,
      language: data.language || 'Unknown',
      languages,
      topics: data.topics || [],
      technologies,
      hasPackageJson,
      hasRequirementsTxt,
      hasComposerJson,
      hasPubspec,
      isPrivate: data.private || false,
      url: data.html_url,
    };
  } catch (error) {
    console.error('[GitHub] Analysis error:', error);
    throw error;
  }
}
