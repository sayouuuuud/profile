# Database Schema Documentation

## Overview

The database uses a unified schema split across migration files:

- **`001_create_schema.sql`** - Base schema initialization
- **`001_tables.sql`** - Core portfolio tables (site settings, skills, case studies, etc.)
- **`002_ai_features_extended_schema.sql`** - AI Features (Parser, Case Study Generator, Morning Brief)

---

## AI Features Extended Schema (002)

### AI Project Parser Tables

#### `parsed_projects`
Stores analyzed projects from AI Parser.

```
id (UUID) - Primary key
user_id (UUID) - User who created it
source_type (text) - 'text' | 'github' | 'voice'
title, description, tech_stack, key_features
confidence_score (0-1) - AI confidence level
parsed_by (text) - AI model used (e.g., 'gemini-2.0')
raw_analysis (JSONB) - Full AI response
```

**Indexes:** user_id, created_at, source_type

---

### Case Study Generator Tables

#### `case_study_projects`
Projects imported for case study generation.

```
id (UUID) - Primary key
user_id (UUID) - Owner
name, github_url, description
tech_stack (array), architecture (text)
repository_structure (JSONB) - Full repo analysis
import_status - 'pending' | 'analyzing' | 'analyzed' | 'failed'
```

#### `github_analysis`
Deep GitHub repository analysis results.

```
id (UUID) - Primary key
project_id (FK) - Links to case_study_projects
repository_structure (JSONB) - Files, folders, structure
tech_stack_analysis (JSONB) - Languages, frameworks, libraries
identified_patterns (array) - Design patterns found
potential_challenges (array) - Issues/risks identified
strengths (array) - Project strengths
repo_stats (JSONB) - Stars, forks, commits, etc.
```

#### `case_study_interview_questions`
AI-generated interview questions based on GitHub analysis.

```
id (UUID) - Primary key
analysis_id (FK) - Links to github_analysis
project_id (FK) - Links to case_study_projects
question_order (int) - Sequence number
question_text (text) - The question
question_context (text) - Why this question matters
category - 'architecture' | 'performance' | 'security' | 'ux' | 'business'
```

#### `case_study_responses`
User's interview responses.

```
id (UUID) - Primary key
project_id (FK) - Links to case_study_projects
question_id (FK) - Links to case_study_interview_questions
answer_text (text) - Text response
answer_audio_url (text) - Voice response URL
response_type - 'text' | 'voice'
```

#### `case_study_generation_metadata`
Links AI-generated case studies to their source project & analysis.

```
id (UUID) - Primary key
case_study_id (FK) - Links to existing case_studies table
project_id (FK) - Links to case_study_projects
analysis_id (FK) - Links to github_analysis
generation_status - 'draft' | 'generated' | 'published' | 'archived'
github_repo_url (text)
interview_count (int)
generation_completed_at (timestamp)
generated_by (text) - 'case-study-generator'
```

---

### Morning Brief Analytics Tables

#### `daily_analytics`
Daily aggregated analytics snapshot.

```
id (UUID) - Primary key
user_id (UUID)
date (date) - UNIQUE per user
total_visits, unique_visitors, total_clicks
conversion_rate (decimal %), bounce_rate (decimal %)
top_traffic_source (text)
avg_session_duration (seconds)
source_data (JSONB) - Raw analytics data
UNIQUE constraint: (user_id, date)
```

#### `analytics_insights`
AI-generated insights from analytics data.

```
id (UUID) - Primary key
user_id (UUID)
date (date)
insight_type - 'trend' | 'anomaly' | 'opportunity' | 'recommendation'
title, description (text)
metric_value, metric_change (decimal), metric_label
action_label, action_href (for clickable insights)
priority - 'high' | 'medium' | 'low'
insight_category (text)
generated_by - 'gemini-2.0'
```

#### `daily_actions`
Actionable recommendations for the day.

```
id (UUID) - Primary key
user_id (UUID)
brief_date (date)
action_title, description
priority - 'high' | 'medium' | 'low'
impact (text) - Expected impact
action_label, action_href (for CTAs)
estimated_time_minutes (int)
completed (boolean)
completed_at (timestamp)
```

#### `traffic_sources`
Traffic source breakdown per day.

```
id (UUID) - Primary key
user_id (UUID)
date (date)
source_name (text)
source_type - 'organic' | 'direct' | 'referral' | 'social' | 'paid' | 'other'
visits, visitors, conversion_count
revenue (decimal)
UNIQUE constraint: (user_id, date, source_name)
```

#### `page_performance`
Per-page performance metrics.

```
id (UUID) - Primary key
user_id (UUID)
date (date)
page_path, page_title
visits, unique_visitors
bounce_rate (%), avg_time_on_page (seconds)
conversions, revenue
UNIQUE constraint: (user_id, date, page_path)
```

#### `leads_tracking`
Visitor/lead tracking and engagement.

```
id (UUID) - Primary key
user_id (UUID)
company_name, contact_name, email
engagement_score (0-100)
last_visit (timestamp)
time_on_site (seconds)
pages_visited (array of URLs)
status - 'new' | 'warm' | 'contacted' | 'converted'
follow_up_due_date (date)
notes (text)
source_page (text)
Indexes: user_id, status, email
```

#### `morning_brief_history`
Archive of all sent morning briefs.

```
id (UUID) - Primary key
user_id (UUID)
brief_date (date) - UNIQUE per user
brief_content (JSONB) - Full brief JSON
summary (text)
insights_count, actions_count (int)
sent_at (timestamp)
telegram_message_id (text)
telegram_sent, email_sent (boolean)
UNIQUE constraint: (user_id, brief_date)
```

---

### User Preferences & Analytics Tables

#### `user_ai_preferences`
User preferences for AI features.

```
id (UUID) - Primary key
user_id (UUID) - UNIQUE
ai_parser_enabled (boolean)
case_study_notifications (boolean)
morning_brief_enabled (boolean)
morning_brief_time (time) - Default: 09:00
telegram_user_id, telegram_chat_id
email_notifications (boolean)
preferred_language - Default: 'en'
```

#### `feature_usage_log`
Track which features are being used.

```
id (UUID) - Primary key
user_id (UUID)
feature_name - 'ai_parser' | 'scalability_simulator' | 'case_study_generator' | 'morning_brief'
action (text) - What user did
duration_seconds (int)
status - 'success' | 'error' | 'incomplete'
error_message (text)
metadata (JSONB)
Indexes: user_id, feature_name, created_at
```

---

## Views (Analytics-Ready)

### `latest_morning_briefs`
Get the most recent morning brief for each user.

```sql
SELECT DISTINCT ON (user_id)
  user_id, brief_date, brief_content, insights_count, actions_count, created_at
FROM morning_brief_history
ORDER BY user_id, brief_date DESC
```

### `user_feature_stats`
Aggregated usage stats per user per feature.

```sql
SELECT
  user_id, feature_name,
  COUNT(*) as total_uses,
  COUNT(CASE WHEN status='success' THEN 1 END) as successful_uses,
  AVG(duration_seconds) as avg_duration,
  MAX(created_at) as last_used_at
```

---

## Key Features

### Timestamp Management
- All timestamps use `TIMESTAMPTZ` (timezone-safe)
- Automatic `updated_at` via triggers
- Prevents timezone inconsistencies

### Data Integrity
- Foreign keys with `ON DELETE CASCADE` for proper cleanup
- UNIQUE constraints prevent duplicate entries
- CHECK constraints enforce valid enum values

### Performance
- Indexes on frequently queried columns (user_id, date, status)
- Views pre-aggregate data
- Proper normalization avoids redundancy

### Security
- Ready for Row Level Security (RLS) policies
- User isolation via `user_id` column
- No sensitive data stored directly (encrypted via Supabase)

---

## Migration Order

1. **`001_create_schema.sql`** - Sets up schema namespace
2. **`001_tables.sql`** - Creates core portfolio tables
3. **`002_ai_features_extended_schema.sql`** - Adds AI feature tables

Run in Supabase SQL Editor:
```sql
-- Copy entire 001_create_schema.sql content, click Run
-- Copy entire 001_tables.sql content, click Run
-- Copy entire 002_ai_features_extended_schema.sql content, click Run
```

---

## Future Extensions

Ready for:
- Row Level Security (RLS) policies for multi-tenant
- Audit logging via triggers
- Soft deletes with `deleted_at` column
- Full-text search on case studies & insights
- Real-time subscriptions via Supabase realtime
