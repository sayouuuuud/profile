-- Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT NOT NULL DEFAULT 'Architect Command Center: Sayed Elshazly',
  site_description TEXT,
  hero_name TEXT NOT NULL DEFAULT 'SAYED ELSHAZLY',
  hero_subtitle TEXT DEFAULT '// The Wartime Architect',
  hero_description TEXT,
  hero_image_url TEXT,
  hero_role TEXT DEFAULT 'ARCHITECT',
  hero_class TEXT DEFAULT 'Strategic Executive',
  hero_status TEXT DEFAULT 'OPERATIONAL',
  hero_location TEXT DEFAULT 'CAIRO, EG // REMOTE',
  hero_timezone TEXT DEFAULT 'UTC+3',
  contact_email TEXT,
  contact_phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  description TEXT,
  chart_type TEXT DEFAULT 'bar',
  chart_data JSONB,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.executive_brief (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  philosophy TEXT DEFAULT 'Ship to learn. Optimize to scale.',
  operating_model TEXT DEFAULT 'ZERO-SUM EXECUTION',
  velocity_factor TEXT DEFAULT 'HIGH-FREQUENCY',
  summary TEXT,
  experience_highlights JSONB,
  tags JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  proficiency INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INT DEFAULT 0,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  achievements JSONB,
  tags JSONB,
  status TEXT DEFAULT 'COMPLETED',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  category TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_year TEXT,
  end_year TEXT,
  grade TEXT,
  description TEXT,
  achievements JSONB,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.arsenal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  icon_url TEXT,
  proficiency INT DEFAULT 0,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  client TEXT,
  category TEXT,
  status TEXT DEFAULT 'COMPLETED',
  date TEXT,
  duration TEXT,
  team_size TEXT,
  thumbnail_url TEXT,
  cover_image_url TEXT,
  summary TEXT,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  impact TEXT,
  tags JSONB,
  metrics JSONB,
  tech_stack JSONB,
  architecture_nodes JSONB,
  code_snippets JSONB,
  gallery_images JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  is_starred BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT DEFAULT '#10b981',
  accent_color TEXT DEFAULT '#34d399',
  gold_color TEXT DEFAULT '#d4af37',
  background_color TEXT DEFAULT '#050505',
  surface_color TEXT DEFAULT '#0a0a0a',
  border_color TEXT DEFAULT '#1f2937',
  font_display TEXT DEFAULT 'Space Grotesk',
  font_serif TEXT DEFAULT 'Cinzel',
  dark_mode BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.datalinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT,
  icon TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.landing_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  content JSONB,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);
