# 🚀 Deployment Guide

**IMPORTANT:** This app uses **Supabase** (cloud database) - NO local database required.

## Pre-Deployment Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] Supabase project created and populated
- [ ] Database tables created (2 SQL scripts)
- [ ] All API keys obtained

## Deployment Steps

### 1. Prepare Supabase Project (Once)

1. Sign up at https://supabase.com (free tier available)
2. Create new project
3. Go to SQL Editor in dashboard
4. Run both SQL scripts:
   - `scripts/create-case-study-tables.sql`
   - `scripts/create-analytics-tables.sql`
5. Get credentials from Settings → API

### 2. Set Vercel Environment Variables

In your Vercel project settings, add:

**Required (Database):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Optional (API Features):**
```
GEMINI_API_KEY=AIzaSy...
GITHUB_TOKEN=ghp_...
TELEGRAM_BOT_TOKEN=123:ABC...
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 3. Deploy to Vercel

```bash
# Via Git
git push origin main

# Or via CLI
vercel --prod
```

### 4. Test After Deployment

Visit your deployed site:
- `/tools/ai-parser` - should work with mock or real Gemini
- `/tools/scalability` - should work immediately
- `/tools/case-study-generator` - requires GitHub token
- `/tools/morning-brief` - requires Gemini API

## Database Status

The app will show a warning if Supabase is not configured, but will still work with mock data.

### Features Without Supabase
- All UI components render
- Mock data demonstrations work
- Animations and interactions function

### Features Requiring Supabase
- Saving projects to database
- Case study generation and storage
- Analytics data persistence
- User preferences

## Database Troubleshooting

| Issue | Solution |
|-------|----------|
| `Missing SUPABASE_URL` | Check Vercel env vars match .env.example |
| `Authentication failed` | Verify correct Supabase keys (not swapped) |
| `Table does not exist` | Run SQL scripts in Supabase SQL Editor |
| `CORS errors` | Supabase handles this automatically |

## Production Best Practices

1. **Never commit `.env.local`** to git
2. **Rotate keys regularly** in Supabase settings
3. **Enable RLS** (Row Level Security) on sensitive tables
4. **Monitor** Supabase project usage (free tier: 500MB DB)
5. **Backup** database regularly

## Scaling

Supabase free tier includes:
- ✅ 500 MB database
- ✅ Unlimited API calls
- ✅ Unlimited users
- ✅ Real-time subscriptions

For production scale-up, upgrade to paid plan.

## Need Help?

- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- GitHub issues: Check project repository
