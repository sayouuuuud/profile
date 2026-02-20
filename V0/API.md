# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

---

## AI Parser API

### Parse Project
**Endpoint:** `POST /api/ai/parse-project`

**Description:** Parse project information from text, GitHub URL, or voice

**Request Body:**
```json
{
  "input": "string",
  "source": "text" | "voice" | "github"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/parse-project \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Built a React app with 50k users, 99.9% uptime",
    "source": "text"
  }'
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully parsed project: TaskMaster Pro",
  "data": {
    "title": "TaskMaster Pro",
    "description": "A full-stack task management platform...",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "kpis": {
      "users": "50000",
      "uptime": "99.9%"
    },
    "github_url": "https://github.com/user/repo",
    "confidence": 92
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Failed to analyze GitHub repository: Repository not found"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid input or GitHub URL
- `500` - Server error

**Notes:**
- For GitHub URLs, pass: `https://github.com/owner/repo`
- Confidence score (0-100) indicates data extraction quality
- Maximum input length: 5000 characters
- Response time: 3-8 seconds (includes API calls)

---

## Case Study APIs

### Analyze GitHub Repository
**Endpoint:** `POST /api/case-studies/analyze-github`

**Description:** Analyze a GitHub repo and generate interview questions

**Request Body:**
```json
{
  "github_url": "https://github.com/owner/repo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "repo_name": "project-name",
    "description": "Project description...",
    "technologies": ["React", "Node.js"],
    "stars": 1250,
    "questions": [
      "What were the main technical challenges?",
      "How did you approach scalability?",
      ...
    ]
  }
}
```

### Generate Case Study
**Endpoint:** `POST /api/case-studies/generate`

**Description:** Generate a polished case study from interview responses

**Request Body:**
```json
{
  "project_id": "string",
  "analysis": {
    "repo_name": "string",
    "technologies": ["string"],
    ...
  },
  "responses": {
    "question_1": "answer text",
    "question_2": "answer text",
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "case_study_id": "uuid",
    "title": "Generated title",
    "content": "Formatted markdown content...",
    "sections": {
      "overview": "...",
      "challenges": "...",
      "solution": "...",
      "results": "..."
    }
  }
}
```

---

## Morning Brief API

### Generate Morning Brief
**Endpoint:** `POST /api/morning-brief/generate`

**Description:** Generate AI-powered daily analytics brief

**Request Body:**
```json
{
  "user_id": "string",
  "days": 7,
  "metrics": {
    "visits": 1250,
    "visitors": 850,
    "clicks": 3200,
    "conversions": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "brief_id": "uuid",
    "date": "2024-01-15",
    "summary": "Yesterday you had 1,250 visits...",
    "insights": [
      {
        "type": "trend",
        "title": "Upward trend detected",
        "description": "Visits increased 25% compared to last week",
        "severity": "positive"
      },
      ...
    ],
    "actions": [
      {
        "priority": "high",
        "action": "Update homepage content",
        "reason": "Low engagement on homepage",
        "impact": "Could increase CTR by 15%"
      },
      ...
    ],
    "metrics": {
      "visits": { "value": 1250, "change": "+25%" },
      "visitors": { "value": 850, "change": "+18%" },
      "conversion_rate": { "value": "3.6%", "change": "+0.5%" }
    }
  }
}
```

### Cron Job (Scheduled)
**Endpoint:** `GET /api/cron/morning-brief`

**Description:** Automatically generates and sends morning briefs

**Frequency:** Daily at 8:00 AM (configurable)

**Triggered by:** Vercel Cron (or external scheduler)

**Environment Variables Needed:**
- `TELEGRAM_BOT_TOKEN` (for Telegram delivery)

**Response:**
```json
{
  "success": true,
  "briefs_generated": 5,
  "briefs_sent": 5,
  "timestamp": "2024-01-15T08:00:00Z"
}
```

---

## Telegram Bot API

### Webhook Handler
**Endpoint:** `POST /api/telegram/webhook`

**Description:** Receives and processes Telegram messages

**Supported Commands:**
- `/add_project` - Start project addition workflow
- `/list_projects` - View all projects
- `/analyze_scalability` - Launch scalability simulator
- `/morning_brief` - Send today's brief
- `/help` - Show help menu

**Message Types:**
- Text messages (project descriptions)
- Voice messages (transcribed to text)
- Document uploads (future feature)

**Example Workflow:**
1. User sends `/add_project`
2. Bot responds with input methods
3. User sends project description
4. Bot calls `/api/ai/parse-project`
5. Bot displays parsed data with approve/edit buttons
6. User confirms
7. Project saved to database

**Note:** Webhook URL must be set in Telegram Bot API settings:
```bash
POST https://api.telegram.org/bot{TOKEN}/setWebhook?url={YOUR_URL}/api/telegram/webhook
```

---

## Database Operations API

### Database Utilities
Located in `lib/db.ts` - Server-side only

**Project Operations:**
```typescript
saveProject(userId, projectData) → Project
getProjects(userId) → Project[]
```

**Case Study Operations:**
```typescript
saveCaseStudy(userId, caseStudyData) → CaseStudy
```

**Analytics Operations:**
```typescript
logDailyAnalytics(userId, data) → Analytics
getRecentAnalytics(userId, days?) → Analytics[]
```

**Morning Brief Operations:**
```typescript
saveMorningBrief(userId, briefData) → MorningBrief
getTodaysBrief(userId) → MorningBrief | null
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Code | Message | Reason |
|------|---------|--------|
| 400 | Missing required fields | Invalid request body |
| 400 | Invalid source | source not in [text, voice, github] |
| 400 | Invalid GitHub URL | URL format incorrect |
| 401 | Unauthorized | Missing or invalid auth token |
| 404 | Not found | Resource doesn't exist |
| 429 | Too many requests | Rate limit exceeded |
| 500 | Server error | API processing failed |

### Retry Policy
- Automatic retry with exponential backoff: 2s, 4s, 8s
- Maximum 3 retries for transient errors
- Graceful fallback to mock data on repeated failures

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/ai/parse-project` | 100 | 1 hour |
| `/api/case-studies/*` | 50 | 1 hour |
| `/api/morning-brief/*` | 10 | 1 day |
| `/api/telegram/webhook` | Unlimited | N/A |

---

## Authentication

**Current:** None (demo mode)

**Recommended for Production:**
1. Add user authentication (Supabase Auth or NextAuth.js)
2. Add API key validation
3. Use JWT tokens
4. Implement row-level security (RLS) in database
5. Rate limiting per user/API key

Example header:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## Testing

### Using cURL

**Test Text Parser:**
```bash
curl -X POST http://localhost:3000/api/ai/parse-project \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Built a mobile app with 100k downloads using Flutter",
    "source": "text"
  }'
```

**Test GitHub Parser:**
```bash
curl -X POST http://localhost:3000/api/ai/parse-project \
  -H "Content-Type: application/json" \
  -d '{
    "input": "https://github.com/vercel/next.js",
    "source": "github"
  }'
```

**Test Morning Brief:**
```bash
curl -X POST http://localhost:3000/api/morning-brief/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "metrics": {
      "visits": 1500,
      "visitors": 900,
      "clicks": 4200,
      "conversions": 75
    }
  }'
```

### Using Postman

1. Import collection from: `/postman/collection.json` (create this)
2. Set environment variables
3. Test each endpoint
4. Check response times and error handling

---

## Performance

### Response Times (P95)
- `/api/ai/parse-project` (text): 2-3 seconds
- `/api/ai/parse-project` (github): 3-5 seconds
- `/api/case-studies/generate`: 4-6 seconds
- `/api/morning-brief/generate`: 2-4 seconds

### Caching
- GitHub analysis: 24 hours (CDN)
- Project metadata: 1 hour
- Analytics summaries: 15 minutes

---

## Webhooks

### Telegram Webhook
**URL:** `POST /api/telegram/webhook`

**Frequency:** Real-time (as messages arrive)

**Payload Example:**
```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 100,
    "chat": { "id": 987654321, "type": "private" },
    "text": "/add_project"
  }
}
```

### Scheduled Cron
**URL:** `GET /api/cron/morning-brief`

**Frequency:** Daily at 8:00 AM UTC

**Triggered by:** Vercel Cron Jobs or external scheduler

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] API keys validated
- [ ] Rate limiting configured
- [ ] Error tracking enabled (Sentry)
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] CORS configured
- [ ] SSL/TLS enabled
- [ ] DDoS protection enabled

---

## Support & Debugging

### Check API Status
```bash
curl -X GET http://localhost:3000/api/health
```

### View Logs
- Server logs: Check terminal running `npm run dev`
- Client logs: Browser DevTools Console
- Database logs: Supabase dashboard

### Debug Mode
Add to `.env.local`:
```
DEBUG=*
```

---

## Changelog

### v1.0.0 (Current)
- AI Project Parser API
- Case Study Generator API
- Morning Brief API
- Telegram Bot Integration
- Scalability Simulator (client-side)
