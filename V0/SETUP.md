# Project Setup Guide

## Overview
This project implements 4 interactive AI-powered features for a professional portfolio:
1. **AI Project Parser** - Parse projects from text, GitHub URLs, or voice
2. **Scalability Simulator** - Interactive architecture visualizer
3. **Hybrid Case Study Generator** - GitHub-to-interview workflow
4. **Enhanced Morning Brief** - AI-powered daily analytics

## Prerequisites
- Node.js 18+ & pnpm
- GitHub account (for token)
- Google Cloud account (Gemini API)
- Telegram Bot (optional, for voice integration)
- Supabase account (for database)

---

## Environment Setup

### 1. Create `.env.local`
Copy from `.env.example` and fill in your keys:

```bash
cp .env.example .env.local
```

### 2. Get API Keys

#### **Gemini API Key**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and add to `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

#### **GitHub Token**
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Create Personal Access Token with `repo` scope
3. Add to `.env.local`:
```
GITHUB_TOKEN=your_token_here
```

#### **Telegram Bot Token** (Optional)
1. Chat with [@BotFather](https://t.me/botfather) on Telegram
2. Create new bot and get token
3. Add webhook: `/api/telegram/webhook`
4. Add to `.env.local`:
```
TELEGRAM_BOT_TOKEN=your_token_here
```

#### **Supabase Setup**
1. Create project at [supabase.com](https://supabase.com)
2. Get URL and keys from Project Settings
3. Run migrations: `npm run db:migrate`
4. Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

---

## Database Setup

### Run Migrations
In Supabase SQL Editor, execute scripts in order:

1. `scripts/001_create_schema.sql` - Schema initialization
2. `scripts/001_tables.sql` - Core portfolio tables
3. `scripts/002_ai_features_extended_schema.sql` - AI Features schema (Parser, Case Study Generator, Morning Brief)

This creates tables for:
- **AI Project Parser**: `parsed_projects`
- **Case Study Generator**: `case_study_projects`, `github_analysis`, `case_study_interview_questions`, `case_study_responses`, `case_study_generation_metadata`
- **Morning Brief**: `daily_analytics`, `analytics_insights`, `daily_actions`, `traffic_sources`, `page_performance`, `leads_tracking`, `morning_brief_history`
- **User Preferences**: `user_ai_preferences`, `feature_usage_log`

---

## Running the Project

### Development
```bash
npm run dev
```

Visit `http://localhost:3000`

### Build & Production
```bash
npm run build
npm start
```

---

## Feature URLs

| Feature | URL | API |
|---------|-----|-----|
| AI Parser | `/tools/ai-parser` | `/api/ai/parse-project` |
| Scalability | `/tools/scalability` | None (client-side) |
| Case Study | `/tools/case-study-generator` | `/api/case-studies/*` |
| Morning Brief | `/tools/morning-brief` | `/api/morning-brief/generate` |
| Telegram | N/A | `/api/telegram/webhook` |

---

## Testing APIs

### Test AI Parser
```bash
curl -X POST http://localhost:3000/api/ai/parse-project \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Built a React app with Node.js backend, 50k users, 99.9% uptime",
    "source": "text"
  }'
```

### Test GitHub Analysis
```bash
curl -X POST http://localhost:3000/api/ai/parse-project \
  -H "Content-Type: application/json" \
  -d '{
    "input": "https://github.com/vercel/next.js",
    "source": "github"
  }'
```

---

## Deployment

### Vercel
```bash
vercel deploy
```

Then set environment variables in Vercel dashboard.

### Other Platforms
1. Build: `npm run build`
2. Set all env vars from `.env.local`
3. Run: `npm start`

---

## Troubleshooting

### "GEMINI_API_KEY not set"
- Check `.env.local` has the key
- Verify key is valid at Google AI Studio
- Restart dev server

### "GitHub token invalid"
- Check token has `repo` scope
- Verify token is not expired
- Test with: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`

### "Supabase connection failed"
- Verify URL and keys are correct
- Check database is created
- Run migrations: `npm run db:migrate`

### "Telegram webhook not working"
- Verify bot token is correct
- Check `/api/telegram/webhook` is accessible
- Test: `curl https://yourdomain.com/api/telegram/webhook`

---

## Architecture

```
/app
  /api
    /ai/parse-project          # Gemini API integration
    /case-studies              # Case study generation
    /morning-brief             # Analytics & insights
    /telegram/webhook          # Bot integration
    /cron/morning-brief        # Scheduled tasks
  /tools
    /ai-parser                 # Parser UI
    /scalability               # Simulator UI
    /case-study-generator      # Case study workflow
    /morning-brief             # Analytics dashboard
/lib
  /gemini.ts                   # AI parsing logic
  /github.ts                   # GitHub analysis
  /telegram-bot.ts             # Bot utilities
  /db.ts                       # Database queries
/components
  /ai-parser                   # Parser components
  /case-study                  # Case study components
  /scalability                 # Simulator components
  /morning-brief               # Analytics components
```

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up Telegram webhook
3. ✅ Configure cron job for morning briefs
4. ✅ Add user authentication
5. ✅ Implement analytics tracking
6. ✅ Build mobile apps

---

## Support

For issues or questions:
- Check logs: `npm run dev` (client & server logs)
- Review `.env.example` for required vars
- Test APIs with curl before debugging UI
- Check Supabase console for database errors
