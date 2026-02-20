# 🚀 Quick Start Guide

Get the project running in 5 minutes.

## 1️⃣ Install Dependencies
```bash
pnpm install
```

## 2️⃣ Setup Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

### Quick Setup (Demo Mode)
Just run with defaults - features work with mock data:
```bash
npm run dev
# Visit http://localhost:3000
```

### Full Setup (Real APIs)

Get your API keys:

**Gemini API** (Free):
1. Go to https://aistudio.google.com/app/apikey
2. Create API Key
3. Add to `.env.local`:
```
GEMINI_API_KEY=your_key
```

**GitHub Token** (Free):
1. Go to https://github.com/settings/tokens
2. Create Personal Access Token with `repo` scope
3. Add to `.env.local`:
```
GITHUB_TOKEN=your_token
```

**Telegram Bot** (Optional):
1. Chat with @BotFather on Telegram
2. Create bot and get token
3. Add to `.env.local`:
```
TELEGRAM_BOT_TOKEN=your_token
```

**Supabase** (Free tier):
1. Sign up at https://supabase.com
2. Create a project
3. Get URL and keys from Settings
4. Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
```

## 3️⃣ Create Database Tables (Optional)

If using real Supabase:
1. Go to Supabase dashboard
2. Open SQL Editor
3. Copy-paste from `scripts/create-case-study-tables.sql`
4. Run
5. Repeat for `scripts/create-analytics-tables.sql`

## 4️⃣ Run Dev Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 5️⃣ Try Features

### AI Project Parser
1. Go to `/tools/ai-parser`
2. Select "Text" mode
3. Type: "Built a React app with 50k users"
4. Click "Parse"

### Scalability Simulator
1. Go to `/tools/scalability`
2. Drag the slider from left to right
3. Watch costs and architecture change

### Case Study Generator
1. Go to `/tools/case-study-generator`
2. Enter: `https://github.com/vercel/next.js`
3. Click "Analyze"
4. Answer the questions
5. Get case study

### Morning Brief
1. Go to `/tools/morning-brief`
2. View AI-generated insights
3. See actionable recommendations

---

## 📋 Features Status

| Feature | Demo Mode | Full Mode |
|---------|-----------|-----------|
| AI Parser | ✅ Mock data | ✅ Real API |
| Scalability | ✅ Works | ✅ Works |
| Case Study | ✅ Mock data | ✅ Real API |
| Morning Brief | ✅ Mock data | ✅ Real API |
| Telegram | ❌ Needs token | ✅ Works |

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### API Errors
1. Check `.env.local` has all keys
2. Try in "Text" mode (simpler)
3. Check browser console (F12)

### Database Errors
1. Verify Supabase credentials
2. Check tables were created
3. Check RLS policies (if needed)

### Styles Look Wrong
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server
3. Check Tailwind build

---

## 📚 Next Steps

- Read `SETUP.md` for detailed setup
- Read `API.md` for API documentation
- Check `IMPLEMENTATION_CHECKLIST.md` for feature list
- Deploy to Vercel: `vercel deploy`

---

## 💡 Pro Tips

1. **Enable Debug Mode**
   ```
   DEBUG=* npm run dev
   ```

2. **Test APIs with Curl**
   ```bash
   curl -X POST http://localhost:3000/api/ai/parse-project \
     -H "Content-Type: application/json" \
     -d '{"input":"Built a React app","source":"text"}'
   ```

3. **Skip Database Setup**
   - Features work with mock data
   - No database needed for demo

4. **Use Telegram Later**
   - Add bot token when ready
   - Webhook endpoint: `/api/telegram/webhook`

---

## ✅ You're Ready!

Everything is set up. Start with the demo and add real APIs as needed.

Questions? Check the documentation files.

Happy building! 🎉
