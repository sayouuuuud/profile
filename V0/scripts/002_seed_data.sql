-- ============================================
-- PORTFOLIO SEED DATA
-- Real CV data for Sayed Abd-Elsalam Elshazly
-- Run AFTER 001_create_schema.sql
-- ============================================

-- Clear existing data
DELETE FROM public.skills;
DELETE FROM public.skill_categories;
DELETE FROM public.metrics;
DELETE FROM public.operations;
DELETE FROM public.certificates;
DELETE FROM public.education;
DELETE FROM public.arsenal;
DELETE FROM public.case_studies;
DELETE FROM public.social_links;
DELETE FROM public.datalinks;
DELETE FROM public.landing_sections;
DELETE FROM public.site_settings;
DELETE FROM public.executive_brief;
DELETE FROM public.theme_settings;

-- ========== SITE SETTINGS ==========
INSERT INTO public.site_settings (
  site_title, site_description, hero_name, hero_subtitle, hero_description,
  hero_role, hero_class, hero_status, hero_location, hero_timezone,
  contact_email, contact_phone
) VALUES (
  'Architect Command Center: Sayed Elshazly',
  'Portfolio of Sayed Abd-Elsalam Elshazly - Technical Product Manager & Software Architect',
  'SAYED ELSHAZLY',
  '// The Wartime Architect',
  'High-Velocity Technical Product Manager who thrives at the intersection of complex technology and user-centric design. Specializing in zero-sum engineering, AI orchestration, and mission-critical systems.',
  'TPM',
  'Strategic Executive',
  'OPERATIONAL',
  'CAIRO, EG // REMOTE',
  'UTC+3',
  'sayedelshazly2006@gmail.com',
  '+201020962775'
);

-- ========== EXECUTIVE BRIEF ==========
INSERT INTO public.executive_brief (
  philosophy, operating_model, velocity_factor, summary,
  experience_highlights, tags
) VALUES (
  'Ship to learn. Optimize to scale.',
  'ZERO-SUM EXECUTION',
  'HIGH-FREQUENCY',
  'A highly adaptable Technical Product Manager who combines deep technical expertise with strategic product thinking to drive innovation. Leveraging specialized skills in system architecture and AI orchestration to empower teams, optimize resources, and deliver high-impact digital products.',
  '[
    {"label": "Zero-Cost Architecture", "value": "Engineered 100% cost reduction on hosting using federated free-tier strategy"},
    {"label": "Latency Optimization", "value": "Reduced load times from 5s to under 1s via HLS streaming and Range Requests"},
    {"label": "AI Orchestration", "value": "Multi-agent workflow using AI tools as parallel compute threads"},
    {"label": "Legacy Modernization", "value": "Complete overhaul of legacy e-commerce to modern Laravel architecture"}
  ]'::jsonb,
  '["System Architecture", "AI Orchestration", "Cost Optimization", "Agile Leadership", "User Empathy", "Zero-Sum Engineering"]'::jsonb
);

-- ========== THEME SETTINGS ==========
INSERT INTO public.theme_settings (
  primary_color, accent_color, gold_color,
  background_color, surface_color, border_color,
  font_display, font_serif, dark_mode
) VALUES (
  '#10b981', '#34d399', '#d4af37',
  '#050505', '#0a0a0a', '#1f2937',
  'Space Grotesk', 'Cinzel', true
);

-- ========== SOCIAL LINKS ==========
INSERT INTO public.social_links (platform, url, icon, sort_order) VALUES
  ('LinkedIn', 'https://linkedin.com/in/sayedelshazly', 'Linkedin', 0),
  ('GitHub', 'https://github.com/sayouuuuud', 'Github', 1),
  ('Twitter', 'https://twitter.com/sayedelshazly', 'Twitter', 2),
  ('Email', 'mailto:sayedelshazly2006@gmail.com', 'Mail', 3);

-- ========== METRICS ==========
INSERT INTO public.metrics (title, value, suffix, icon, description, sort_order) VALUES
  ('Projects Delivered', '12', '+', 'Briefcase', 'End-to-end product deliveries across streaming, e-commerce, and enterprise platforms', 0),
  ('Cost Saved', '100', '%', 'TrendingDown', 'Zero-infrastructure cost strategy via federated free-tier architecture', 1),
  ('Load Time Reduction', '5x', '', 'Zap', 'From 5s to under 1s using HLS Streaming and Range Requests optimization', 2),
  ('Training Hours', '114', '+', 'Clock', 'Intensive field training covering PMP foundations, Testing, UI/UX, BSS, and Mobile Networks', 3);

-- ========== SKILL CATEGORIES + SKILLS ==========

-- Product Management
INSERT INTO public.skill_categories (id, name, icon, proficiency, sort_order)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Product Management', 'Target', 92, 0);

INSERT INTO public.skills (category_id, name, level, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Agile & Scrum', 95, 0),
  ('a0000000-0000-0000-0000-000000000001', 'Product Roadmapping', 90, 1),
  ('a0000000-0000-0000-0000-000000000001', 'PRD & User Stories', 88, 2),
  ('a0000000-0000-0000-0000-000000000001', 'Stakeholder Management', 85, 3),
  ('a0000000-0000-0000-0000-000000000001', 'Data-Driven Decisions', 90, 4);

-- Technical Stack
INSERT INTO public.skill_categories (id, name, icon, proficiency, sort_order)
VALUES ('a0000000-0000-0000-0000-000000000002', 'Technical Stack', 'Code', 88, 1);

INSERT INTO public.skills (category_id, name, level, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Next.js / React', 92, 0),
  ('a0000000-0000-0000-0000-000000000002', 'Node.js', 85, 1),
  ('a0000000-0000-0000-0000-000000000002', 'Laravel / PHP', 80, 2),
  ('a0000000-0000-0000-0000-000000000002', 'SQL (Supabase/MySQL)', 88, 3),
  ('a0000000-0000-0000-0000-000000000002', 'System Architecture', 90, 4);

-- Cloud & Infrastructure
INSERT INTO public.skill_categories (id, name, icon, proficiency, sort_order)
VALUES ('a0000000-0000-0000-0000-000000000003', 'Cloud & Infrastructure', 'Cloud', 85, 2);

INSERT INTO public.skills (category_id, name, level, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'Vercel', 95, 0),
  ('a0000000-0000-0000-0000-000000000003', 'Cloudinary', 88, 1),
  ('a0000000-0000-0000-0000-000000000003', 'Supabase', 92, 2),
  ('a0000000-0000-0000-0000-000000000003', 'UploadThing', 85, 3),
  ('a0000000-0000-0000-0000-000000000003', 'Storage Optimization', 90, 4);

-- AI & Automation
INSERT INTO public.skill_categories (id, name, icon, proficiency, sort_order)
VALUES ('a0000000-0000-0000-0000-000000000004', 'AI & Automation', 'Bot', 90, 3);

INSERT INTO public.skills (category_id, name, level, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'AI Agent Orchestration', 95, 0),
  ('a0000000-0000-0000-0000-000000000004', 'Prompt Engineering', 92, 1),
  ('a0000000-0000-0000-0000-000000000004', 'Workflow Automation', 88, 2);

-- Tools & Methods
INSERT INTO public.skill_categories (id, name, icon, proficiency, sort_order)
VALUES ('a0000000-0000-0000-0000-000000000005', 'Tools & Methods', 'Wrench', 87, 4);

INSERT INTO public.skills (category_id, name, level, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000005', 'Jira', 90, 0),
  ('a0000000-0000-0000-0000-000000000005', 'Figma (UI/UX)', 82, 1),
  ('a0000000-0000-0000-0000-000000000005', 'Postman (API Testing)', 88, 2),
  ('a0000000-0000-0000-0000-000000000005', 'Git / GitHub', 92, 3);

-- ========== OPERATIONS (Career Timeline) ==========
INSERT INTO public.operations (title, company, location, start_date, end_date, description, achievements, tags, status, sort_order) VALUES
(
  'Pro Bono Technical Product Manager',
  'Imam Project',
  'Remote',
  'Dec 2025',
  'Present',
  'Lead the end-to-end product development of a scalable religious media streaming platform serving thousands of users, achieving a seamless user experience comparable to Spotify.',
  '[
    "Defined technical roadmap and architecture handling 1,000+ assets (Audio, Video, PDF) with high availability and low latency",
    "Engineered Zero-Infrastructure Cost strategy using federated free tiers (Cloudinary, UploadThing, Vercel) - 100% hosting cost reduction",
    "Implemented HLS Streaming and Range Requests reducing load times from 5s to under 1s",
    "Designed Seek-Glitch-Free audio player and mobile-responsive interface for maximum user retention",
    "Utilized AI agents to accelerate development cycles, automating content metadata and migration tasks"
  ]'::jsonb,
  '["Next.js", "Supabase", "Cloudinary", "HLS", "AI Orchestration", "Vercel"]'::jsonb,
  'ACTIVE',
  0
),
(
  'Technical Product Manager & Lead Engineer',
  'Infinite Tech (Mostaql.com)',
  'Remote',
  'Jul 2024',
  'Sep 2024',
  'Directed the complete overhaul of "Infinite Tech," a legacy e-commerce platform, transforming it into a modern, high-performance marketplace.',
  '[
    "Led migration from legacy system to custom Laravel-based architecture, resolving critical technical debt",
    "Shipped Dynamic Filtering System and Real-time Inventory Management dashboard",
    "Established Agile workflows (Sprints, Backlog Grooming) improving delivery speed",
    "Delivered project on time and within budget with significantly improved UI/UX"
  ]'::jsonb,
  '["Laravel", "PHP", "MySQL", "Agile", "E-commerce"]'::jsonb,
  'COMPLETED',
  1
);

-- ========== CERTIFICATES ==========
INSERT INTO public.certificates (title, issuer, issue_date, category, sort_order) VALUES
  ('Agile Explorer', 'IBM Skills', '2024', 'Product Management', 0),
  ('The Practical Training for Product Owner', 'Professional Training Institute', '09/2025 - 10/2025', 'Product Management', 1),
  ('WE Applied Technology Professional Certificate', 'WE Telecom Egypt', '2021 - 2024', 'Engineering', 2),
  ('Career Development Training', 'Plan International Egypt', '2024', 'Professional Development', 3);

-- ========== EDUCATION ==========
INSERT INTO public.education (institution, degree, field_of_study, start_year, end_year, description, achievements, sort_order) VALUES
(
  'New Cairo Technological University',
  'Bachelor of Technology',
  'Information Technology',
  '2024',
  'Present',
  'Pursuing a Bachelor of Technology degree with focus on IT and modern software engineering.',
  NULL,
  0
),
(
  'We School For Applied Technology',
  'Applied Technology Diploma',
  'IT & Web Development',
  '2021',
  '2024',
  'Completed intensive applied technology program covering full-stack development, networking, and enterprise systems.',
  '[
    "114+ Hours of intensive field training",
    "PMP Foundations",
    "Software Testing",
    "UI/UX Design",
    "Mobile Network Infrastructure"
  ]'::jsonb,
  1
);

-- ========== ARSENAL (Tools & Technologies) ==========
INSERT INTO public.arsenal (name, category, proficiency, sort_order) VALUES
  ('Next.js', 'Frontend', 92, 0),
  ('React', 'Frontend', 90, 1),
  ('TypeScript', 'Language', 85, 2),
  ('Node.js', 'Backend', 85, 3),
  ('Laravel', 'Backend', 80, 4),
  ('Supabase', 'Database', 92, 5),
  ('MySQL', 'Database', 85, 6),
  ('Vercel', 'Cloud', 95, 7),
  ('Cloudinary', 'Cloud', 88, 8),
  ('Figma', 'Design', 82, 9),
  ('Git / GitHub', 'DevOps', 92, 10),
  ('Jira', 'PM Tools', 90, 11),
  ('Postman', 'Testing', 88, 12),
  ('Tailwind CSS', 'Frontend', 93, 13),
  ('AI Tools', 'AI', 95, 14);

-- ========== CASE STUDIES ==========
INSERT INTO public.case_studies (
  slug, title, subtitle, client, category, status, date, duration, team_size,
  summary, description, challenge, solution, impact,
  tags, metrics, tech_stack, is_featured, sort_order
) VALUES
(
  'imam-streaming-platform',
  'IMAM STREAMING PLATFORM',
  'Zero-Cost Religious Media Streaming at Scale',
  'Imam Project',
  'STREAMING',
  'ACTIVE',
  'Dec 2025',
  '3 Months',
  '3',
  'Built a scalable religious media streaming platform serving thousands of users with zero infrastructure costs, achieving Spotify-level user experience through federated free-tier architecture.',
  'Led the end-to-end product development of a religious media streaming platform handling 1,000+ assets including audio, video, and PDF content. Engineered a zero-cost hosting strategy while maintaining enterprise-grade performance.',
  'Scale a media platform to serve thousands of users with 1,000+ audio/video assets while maintaining zero infrastructure costs and sub-second load times.',
  'Engineered a federated free-tier architecture using Cloudinary for media, UploadThing for images, Vercel for compute, and Supabase for data. Implemented HLS streaming with Range Requests for instant seeking.',
  'Achieved 100% hosting cost reduction, reduced load times from 5s to under 1s, and delivered a seek-glitch-free experience comparable to Spotify.',
  '["Next.js", "Supabase", "Cloudinary", "UploadThing", "HLS", "Vercel", "AI"]'::jsonb,
  '[
    {"label": "Cost Reduction", "value": "100%"},
    {"label": "Load Time", "value": "<1s"},
    {"label": "Assets Managed", "value": "1,000+"},
    {"label": "User Satisfaction", "value": "98%"}
  ]'::jsonb,
  '["Next.js", "React", "Supabase", "Cloudinary", "UploadThing", "Vercel", "Tailwind CSS", "HLS.js"]'::jsonb,
  true,
  0
),
(
  'infinite-tech-marketplace',
  'INFINITE TECH MARKETPLACE',
  'Legacy E-Commerce Modernization',
  'Infinite Tech (Mostaql.com)',
  'E-COMMERCE',
  'COMPLETED',
  'Jul 2024',
  '3 Months',
  '4',
  'Directed the complete overhaul of a legacy e-commerce platform into a modern, high-performance marketplace with dynamic filtering and real-time inventory management.',
  'Led the migration from a legacy system to a custom Laravel-based architecture, resolving critical technical debt and shipping key features that boosted discoverability and operational efficiency.',
  'Modernize a legacy e-commerce platform with critical technical debt while maintaining business continuity and delivering new features on a tight timeline.',
  'Architected a clean Laravel-based system with dynamic filtering, real-time inventory management, and established Agile workflows for the cross-functional team.',
  'Delivered on time and within budget with significantly improved UI/UX that boosted customer satisfaction. Established sustainable Agile processes for future development.',
  '["Laravel", "PHP", "MySQL", "Agile", "E-commerce", "REST API"]'::jsonb,
  '[
    {"label": "Delivery", "value": "On Time"},
    {"label": "Tech Debt", "value": "Resolved"},
    {"label": "Team Size", "value": "4 Engineers"},
    {"label": "Sprint Velocity", "value": "+40%"}
  ]'::jsonb,
  '["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap", "REST API", "Git"]'::jsonb,
  true,
  1
);
