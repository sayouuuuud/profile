-- ============================================
-- UPDATE CASE STUDIES WITH FULL STRUCTURED DATA
-- Adds architecture_nodes, code_snippets, and
-- restructured metrics/challenges/solutions
-- for 100% backend-driven case study pages
-- ============================================

-- Add new columns if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'hero_tag') THEN
    ALTER TABLE public.case_studies ADD COLUMN hero_tag text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'stat_cards') THEN
    ALTER TABLE public.case_studies ADD COLUMN stat_cards jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'challenges') THEN
    ALTER TABLE public.case_studies ADD COLUMN challenges jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'solutions') THEN
    ALTER TABLE public.case_studies ADD COLUMN solutions jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'system_report') THEN
    ALTER TABLE public.case_studies ADD COLUMN system_report jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'footer_text') THEN
    ALTER TABLE public.case_studies ADD COLUMN footer_text text;
  END IF;
END $$;

-- Update Imam Project with FULL structured data
UPDATE public.case_studies
SET
  hero_tag = 'Product Strategy & Technical Architecture',
  stat_cards = '[
    {
      "type": "donut",
      "tag": "OPTIMIZATION_STRATEGY",
      "title": "Zero-Cost Infra",
      "center_value": "0$",
      "center_label": "MONTHLY",
      "description": "Leveraging Free Tiers of Cloudinary, UploadThing, and Vercel to eliminate projected hosting costs.",
      "fill_percent": 75
    },
    {
      "type": "progress",
      "tag": "SYSTEM_CAPACITY",
      "tag_color": "orange",
      "title": "128MB Limit",
      "badge": "BROKEN",
      "bars": [
        {"label": "Standard CMS", "value": "4MB", "percent": 5, "color": "slate"},
        {"label": "IMAM PROJECT", "value": "128MB", "percent": 95, "color": "orange"}
      ],
      "description": "Shattered the standard 4MB limit, supporting massive 128MB PDF uploads for religious manuscripts."
    },
    {
      "type": "bars",
      "tag": "TECHNICAL_EXECUTION",
      "title": "Instant Seek",
      "bar_heights": [30, 50, 40, 70, 100, 60, 45, 25],
      "load_before": "5.0s",
      "load_after": "< 1s"
    }
  ]'::jsonb,
  challenges = '[
    {"title": "Storage Bottlenecks", "desc": "Standard CMS limit of 4MB was insufficient for 128MB+ religious manuscripts."},
    {"title": "Bandwidth Costs", "desc": "Streaming 1,000+ assets would incur massive hosting fees without optimization."},
    {"title": "Latency Issues", "desc": "Initial load times of 5s+ were unacceptable for user retention."}
  ]'::jsonb,
  solutions = '[
    {"title": "Hybrid Storage Engine", "desc": "3-Tier system: UploadThing (Cache), Cloudinary (Opt), Backblaze B2 (Archive)."},
    {"title": "Advanced Streaming", "desc": "HLS & Range Requests reduced load time to <1s with \"Seek-Glitch-Free\" audio."},
    {"title": "AI Orchestration", "desc": "Automated content metadata generation and migration tasks."}
  ]'::jsonb,
  architecture_nodes = '[
    {
      "title": "VERCEL EDGE",
      "sub": "COMPUTE",
      "color": "white",
      "icon_color": "white",
      "icon_bg": "white/5",
      "icon_border": "white/10",
      "icon_type": "vercel",
      "stats": [
        {"l": "FUNCTIONS", "v": "SERVERLESS"},
        {"l": "REGION", "v": "GLOBAL"}
      ]
    },
    {
      "title": "SUPABASE",
      "sub": "POSTGRES + RLS",
      "color": "emerald",
      "icon_color": "emerald-500",
      "icon_bg": "emerald-900/10",
      "icon_border": "emerald-500/20",
      "icon_type": "database",
      "stats": [
        {"l": "SECURITY", "v": "100% RLS", "v_color": "emerald-500"},
        {"l": "MIGRATIONS", "v": "15 SCHEMAS"}
      ]
    },
    {
      "title": "CLOUDINARY",
      "sub": "STREAMING",
      "color": "indigo",
      "icon_color": "indigo-400",
      "icon_bg": "indigo-900/10",
      "icon_border": "indigo-500/20",
      "icon_type": "streaming",
      "stats": [
        {"l": "PROTOCOL", "v": "HLS / RANGE"},
        {"l": "PERF", "v": "INSTANT SEEK"}
      ]
    },
    {
      "title": "UPLOADTHING",
      "sub": "LARGE STORAGE",
      "color": "rose",
      "icon_color": "rose-400",
      "icon_bg": "rose-900/10",
      "icon_border": "rose-500/20",
      "icon_type": "upload",
      "stats": [
        {"l": "PDF LIMIT", "v": "128MB", "v_color": "rose-400"},
        {"l": "TYPE", "v": "CACHE LAYER"}
      ]
    }
  ]'::jsonb,
  code_snippets = '[
    {
      "filename": "~/project_root/technical_dna.json",
      "lang": "BASH",
      "content": [
        {"type": "bracket", "text": "{"},
        {"type": "line", "key": "project_codename", "value": "IMAM_PROJECT"},
        {"type": "object_start", "key": "stack_config"},
        {"type": "kv", "key": "framework", "value": "Next.js 16 (App Router)"},
        {"type": "kv", "key": "database", "value": "Supabase (PostgreSQL)"},
        {"type": "kv", "key": "frontend", "value": "React 19 + Tailwind"},
        {"type": "kv", "key": "infra", "value": "Vercel Edge Functions"},
        {"type": "object_end"},
        {"type": "array_start", "key": "complexity_metrics"},
        {"type": "array_item", "value": "29 Custom API Routes"},
        {"type": "array_item", "value": "118+ React Components"},
        {"type": "array_item", "value": "15 SQL Schemas"},
        {"type": "array_end"},
        {"type": "line", "key": "security", "value": "100% RLS Coverage"},
        {"type": "bracket", "text": "}"}
      ]
    }
  ]'::jsonb,
  system_report = '{
    "version": "V.2.0.4 // LIVE",
    "left_panel": {
      "label": "Row Level Security",
      "badge": "ENFORCED",
      "badge_color": "primary",
      "icon": "security",
      "chart_type": "circle_full",
      "value": "100%",
      "value_label": "Coverage"
    },
    "right_panel": {
      "label": "Backend Scale",
      "badge": "MICRO-SERVICES",
      "badge_color": "indigo",
      "icon": "hub",
      "chart_type": "line_graph",
      "value": "29",
      "value_label": "Endpoints"
    }
  }'::jsonb,
  footer_text = '© 2024 SAYED ELSHAZLY // IMAM_PROJECT ARCHITECTURE'
WHERE slug = 'imam-streaming-platform';

-- Update Infinite Tech with structured data
UPDATE public.case_studies
SET
  hero_tag = 'Legacy Modernization & Agile Transformation',
  stat_cards = '[
    {
      "type": "donut",
      "tag": "DELIVERY_STATUS",
      "title": "On-Time Delivery",
      "center_value": "100%",
      "center_label": "ON SCHEDULE",
      "description": "Delivered the complete platform overhaul on time and within budget constraints.",
      "fill_percent": 100
    },
    {
      "type": "progress",
      "tag": "TECH_DEBT",
      "tag_color": "orange",
      "title": "Debt Resolution",
      "badge": "RESOLVED",
      "bars": [
        {"label": "Before", "value": "Critical", "percent": 85, "color": "red"},
        {"label": "After", "value": "Clean", "percent": 5, "color": "emerald"}
      ],
      "description": "Resolved critical technical debt through complete architecture migration to Laravel."
    },
    {
      "type": "bars",
      "tag": "VELOCITY_BOOST",
      "title": "Sprint Velocity",
      "bar_heights": [20, 35, 45, 55, 70, 85, 95, 100],
      "load_before": "Chaotic",
      "load_after": "+40%"
    }
  ]'::jsonb,
  challenges = '[
    {"title": "Legacy Codebase", "desc": "Outdated architecture with critical technical debt blocking new feature development."},
    {"title": "No Agile Process", "desc": "Team lacked structured workflows, causing missed deadlines and scope creep."},
    {"title": "Poor UX/UI", "desc": "Outdated interface with low conversion rates and poor mobile experience."}
  ]'::jsonb,
  solutions = '[
    {"title": "Laravel Migration", "desc": "Complete architecture overhaul to modern Laravel-based system with clean separation of concerns."},
    {"title": "Agile Implementation", "desc": "Established sprint cycles, backlog grooming, and daily standups for the cross-functional team."},
    {"title": "Dynamic Filtering", "desc": "Built real-time inventory management and dynamic product filtering for better discoverability."}
  ]'::jsonb,
  architecture_nodes = '[
    {
      "title": "LARAVEL",
      "sub": "BACKEND FRAMEWORK",
      "color": "red",
      "icon_type": "code",
      "stats": [
        {"l": "PATTERN", "v": "MVC"},
        {"l": "API", "v": "RESTful"}
      ]
    },
    {
      "title": "MYSQL",
      "sub": "DATABASE",
      "color": "blue",
      "icon_type": "database",
      "stats": [
        {"l": "TYPE", "v": "RELATIONAL"},
        {"l": "QUERIES", "v": "OPTIMIZED"}
      ]
    },
    {
      "title": "JAVASCRIPT",
      "sub": "FRONTEND",
      "color": "yellow",
      "icon_type": "code",
      "stats": [
        {"l": "FRAMEWORK", "v": "VANILLA + JQ"},
        {"l": "UI", "v": "RESPONSIVE"}
      ]
    },
    {
      "title": "GIT",
      "sub": "VERSION CONTROL",
      "color": "orange",
      "icon_type": "code",
      "stats": [
        {"l": "WORKFLOW", "v": "GIT FLOW"},
        {"l": "CI/CD", "v": "AUTOMATED"}
      ]
    }
  ]'::jsonb,
  code_snippets = '[
    {
      "filename": "~/project_root/technical_dna.json",
      "lang": "BASH",
      "content": [
        {"type": "bracket", "text": "{"},
        {"type": "line", "key": "project_codename", "value": "INFINITE_TECH"},
        {"type": "object_start", "key": "stack_config"},
        {"type": "kv", "key": "framework", "value": "Laravel 10 (MVC)"},
        {"type": "kv", "key": "database", "value": "MySQL"},
        {"type": "kv", "key": "frontend", "value": "JavaScript + Bootstrap"},
        {"type": "kv", "key": "infra", "value": "Shared Hosting"},
        {"type": "object_end"},
        {"type": "array_start", "key": "key_features"},
        {"type": "array_item", "value": "Dynamic Filtering System"},
        {"type": "array_item", "value": "Real-time Inventory"},
        {"type": "array_item", "value": "RESTful API Layer"},
        {"type": "array_end"},
        {"type": "line", "key": "methodology", "value": "Agile / Scrum"},
        {"type": "bracket", "text": "}"}
      ]
    }
  ]'::jsonb,
  system_report = '{
    "version": "V.1.0.0 // SHIPPED",
    "left_panel": {
      "label": "Agile Adoption",
      "badge": "ESTABLISHED",
      "badge_color": "primary",
      "icon": "sprint",
      "chart_type": "circle_full",
      "value": "100%",
      "value_label": "Team Adoption"
    },
    "right_panel": {
      "label": "Feature Delivery",
      "badge": "ON-SCHEDULE",
      "badge_color": "indigo",
      "icon": "rocket",
      "chart_type": "line_graph",
      "value": "12",
      "value_label": "Features Shipped"
    }
  }'::jsonb,
  footer_text = '© 2024 SAYED ELSHAZLY // INFINITE_TECH ARCHITECTURE'
WHERE slug = 'infinite-tech-marketplace';
