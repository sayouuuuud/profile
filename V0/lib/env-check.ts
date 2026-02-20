// Environment validation - ensures Supabase is properly configured

export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  geminiApiKey?: string;
  githubToken?: string;
  telegramBotToken?: string;
  apiUrl: string;
}

export function validateEnv(): EnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Supabase is REQUIRED for database operations
  if (!supabaseUrl) {
    throw new Error(
      'CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not set.\n' +
      'This app uses Supabase for database (no local database).\n' +
      'See .env.example for setup instructions.'
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.\n' +
      'Get it from your Supabase project settings.'
    );
  }

  // Service role key required for server-side operations
  if (!supabaseServiceKey) {
    console.warn(
      'WARNING: SUPABASE_SERVICE_ROLE_KEY is not set.\n' +
      'Some API operations may fail. Set it for full functionality.'
    );
  }

  const config: EnvConfig = {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey: supabaseServiceKey || '',
    apiUrl,
    geminiApiKey: process.env.GEMINI_API_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  };

  return config;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDemoMode(): boolean {
  // Demo mode if critical API keys are missing
  return !process.env.GEMINI_API_KEY || !process.env.GITHUB_TOKEN;
}

export function getFeatureStatus() {
  return {
    aiParser: {
      enabled: !!process.env.GEMINI_API_KEY,
      mode: process.env.GEMINI_API_KEY ? 'Live' : 'Mock Data',
    },
    caseStudyGenerator: {
      enabled: !!process.env.GITHUB_TOKEN && !!process.env.GEMINI_API_KEY,
      mode: process.env.GITHUB_TOKEN && process.env.GEMINI_API_KEY ? 'Live' : 'Mock Data',
    },
    morningBrief: {
      enabled: !!process.env.GEMINI_API_KEY,
      mode: process.env.GEMINI_API_KEY ? 'Live' : 'Mock Data',
      telegramEnabled: !!process.env.TELEGRAM_BOT_TOKEN,
    },
  };
}
