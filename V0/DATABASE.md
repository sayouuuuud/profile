# 📊 Database Setup Guide

## ⚠️ IMPORTANT: Cloud-Only Database

This application **does NOT use a local database**. All database operations use **Supabase** (PostgreSQL in the cloud).

### Why Supabase?
- ✅ No local setup required
- ✅ Instant scalability
- ✅ Free tier available
- ✅ Real-time updates
- ✅ Built-in authentication
- ✅ Easy to backup

---

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Choose region closest to you
5. Wait for deployment (2-3 minutes)

### Step 2: Run SQL Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Create new query
3. Copy-paste content from `scripts/create-case-study-tables.sql`
4. Click **Run**
5. Repeat step 2-4 with `scripts/create-analytics-tables.sql`

### Step 3: Get Credentials
1. Go to **Settings** → **API**
2. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`
3. Paste into `.env.local`

### Step 4: Run App
```bash
npm run dev
```

Done! 🎉

---

## Database Schema Overview

### Case Study Tables

**projects** - Stores analyzed projects
- id, user_id, name, github_url, description, tech_stack

**github_analysis** - Technical analysis results
- id, project_id, repository_structure, tech_stack_analysis

**interview_questions** - Smart questions generated per project
- id, analysis_id, question_text, category, context

**case_study_responses** - User answers to questions
- id, project_id, question_id, answer_text, response_type

**case_studies** - Final generated case studies
- id, project_id, content, sections, published_at, slug

### Analytics Tables

**daily_analytics** - Daily metrics snapshot
- id, user_id, date, visits, conversions, bounce_rate

**analytics_insights** - AI-powered insights
- id, user_id, date, insight_type, title, description, priority

**daily_actions** - Actionable recommendations
- id, user_id, date, action_title, priority, completed

**traffic_sources** - Traffic breakdown by source
- id, user_id, date, source_name, visits, conversions

**page_performance** - Per-page metrics
- id, user_id, date, page_path, visits, bounce_rate

**leads_tracking** - Lead management
- id, user_id, company_name, email, status, engagement_score

**morning_brief_history** - Daily brief archive
- id, user_id, brief_date, content, sent_at

---

## API Operations

All database operations use Supabase client:

```typescript
import { supabase } from '@/lib/db';

// Insert
await supabase.from('projects').insert({ ... });

// Select
await supabase.from('projects').select().eq('user_id', userId);

// Update
await supabase.from('projects').update({ ... }).eq('id', id);

// Delete
await supabase.from('projects').delete().eq('id', id);
```

---

## Environment Variables

**Required for database access:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Optional for features:**
```env
GEMINI_API_KEY=AIzaSy...
GITHUB_TOKEN=ghp_...
TELEGRAM_BOT_TOKEN=123:ABC...
```

---

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|-----------|
| Database | Supabase free tier | Supabase paid or free tier |
| Data | Test/demo data | Real user data |
| Backups | Supabase automatic | Same |
| SSL/TLS | Automatic | Automatic |
| Monitoring | Dashboard | Supabase metrics |

---

## Troubleshooting

### "SUPABASE_URL not found"
- Check `.env.local` exists
- Verify it has correct URL format: `https://xxx.supabase.co`

### "Invalid API key"
- Keys might be swapped (anon vs service-role)
- Regenerate in Supabase dashboard

### "Table does not exist"
- Run SQL scripts in Supabase SQL Editor
- Verify migration completed successfully

### "Connection timeout"
- Check Supabase project status (green = running)
- Verify internet connection
- Try again after 30 seconds

### "Permission denied"
- Using wrong key (anon vs service-role)
- Check RLS policies if enabled
- Use service-role key for server operations

---

## Advanced: Row Level Security (RLS)

For production, enable RLS policies:

```sql
-- Example: User can only see their own projects
CREATE POLICY "users_can_see_own_projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
```

See Supabase docs for detailed RLS setup.

---

## Backup & Recovery

Supabase automatically backs up:
- ✅ Every 24 hours
- ✅ Full database snapshots
- ✅ Point-in-time recovery available

To restore:
1. Go to Supabase **Backups**
2. Select backup date
3. Click **Restore**

---

## Migration Notes

If migrating from local database:

1. Export data from old database
2. Run SQL scripts in Supabase
3. Use Supabase data import tools
4. Test thoroughly before cutting over

---

## Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **SQL Reference:** https://www.postgresql.org/docs/current/sql.html
- **GitHub Issues:** Check project repository
