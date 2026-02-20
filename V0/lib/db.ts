import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Project queries
export async function saveProject(userId: string, projectData: any) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: userId,
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies,
        kpis: projectData.kpis,
        github_url: projectData.github_url,
        confidence: projectData.confidence,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Case study queries
export async function saveCaseStudy(userId: string, caseStudyData: any) {
  const { data, error } = await supabase
    .from('case_studies')
    .insert([
      {
        user_id: userId,
        project_id: caseStudyData.project_id,
        content: caseStudyData.content,
        interview_responses: caseStudyData.interview_responses,
        created_at: new Date().toISOString(),
        published: false,
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

// Analytics queries
export async function logDailyAnalytics(userId: string, analyticsData: any) {
  const { data, error } = await supabase
    .from('daily_analytics')
    .insert([
      {
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        visits: analyticsData.visits,
        visitors: analyticsData.visitors,
        clicks: analyticsData.clicks,
        conversions: analyticsData.conversions,
        bounce_rate: analyticsData.bounce_rate,
        avg_session_duration: analyticsData.avg_session_duration,
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getRecentAnalytics(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('daily_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

// Morning brief queries
export async function saveMorningBrief(userId: string, briefData: any) {
  const { data, error } = await supabase
    .from('morning_briefs')
    .insert([
      {
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        insights: briefData.insights,
        actions: briefData.actions,
        summary: briefData.summary,
        sent_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getTodaysBrief(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('morning_briefs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}
