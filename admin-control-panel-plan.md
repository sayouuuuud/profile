# 📋 Implementation Plan - Admin Control Panel

> **ملاحظة:** هذه الخطة موجهة لـ Gemini 2.0 Flash Thinking لتنفيذها. لا تحتوي على أكواد UI جاهزة، بل وصف تفصيلي لما يجب بناؤه.

---

## 🎯 الهدف: صفحة تحكم شاملة داخل الـ Admin Panel

بناء صفحة **Control Panel** داخل الـ Admin Panel الحالي تسمح بـ:
- ⚙️ التحكم في كل الـ configurations (AI, Telegram, Reports)
- 📊 عرض إحصائيات الاستخدام مع charts تفاعلية
- 💰 تحليل التكاليف وعمل projections
- 📋 عرض Activity Logs
- 🧪 Testing tools للـ integrations
- 📥 تصدير البيانات كـ CSV

---

## 🏗️ **الهيكل المطلوب**

```
app/
└── admin/
    ├── page.tsx                           # Dashboard الرئيسية (موجودة)
    ├── projects/                          # إدارة المشاريع (موجودة)
    ├── control/                           # 🆕 صفحة التحكم الجديدة
    │   ├── page.tsx                      # Control Panel الرئيسية
    │   └── components/
    │       ├── ConfigurationPanel.tsx     # AI, Telegram, Reports configs
    │       ├── UsageStats.tsx            # Statistics & Charts
    │       ├── CostAnalysis.tsx          # Cost breakdown
    │       ├── ActivityLogs.tsx          # Recent logs
    │       └── TestingTools.tsx          # Testing utilities
    └── api/
        └── admin/
            └── control/
                ├── config/route.ts        # Get/Update configurations
                ├── stats/route.ts         # Get usage statistics + CSV export
                ├── costs/route.ts         # Get cost analysis
                └── logs/route.ts          # Get activity logs
```

---

## 📊 **Database Schema المطلوب**

يجب إنشاء 4 جداول رئيسية في Supabase:

### Table 1: `system_config`
**الغرض:** تخزين جميع الـ configurations القابلة للتعديل من الـ UI

**الـ Columns:**
- `id` (UUID, Primary Key)
- `category` (TEXT) → القيم الممكنة: 'ai', 'telegram', 'reports'
- `key` (TEXT) → اسم الـ configuration
- `value` (JSONB) → القيمة (مخزنة كـ JSON للمرونة)
- `description` (TEXT) → وصف الـ config
- `is_active` (BOOLEAN) → هل الـ config مفعّل
- `updated_at` (TIMESTAMP)
- `updated_by` (TEXT) → مين عمل التعديل
- `UNIQUE(category, key)` → منع التكرار

**الـ Configurations المطلوبة:**

**AI Configs:**
- `model` → "gemini-1.5-flash" أو "gemini-1.5-pro"
- `temperature` → 0.0 to 1.0
- `max_tokens` → عدد الـ tokens
- `retry_attempts` → عدد المحاولات عند الفشل
- `timeout_seconds` → timeout للـ request

**Telegram Configs:**
- `notifications_enabled` → تشغيل/إيقاف كل الإشعارات
- `notification_types` → JSON object للأنواع المختلفة
- `quiet_hours_enabled` → تفعيل الساعات الهادئة
- `quiet_hours_start` → وقت البداية (24h format)
- `quiet_hours_end` → وقت النهاية
- `rate_limit_per_minute` → حد الرسائل في الدقيقة
- `rate_limit_per_hour` → حد الرسائل في الساعة

**Reports Configs:**
- `daily_enabled` → تفعيل التقرير اليومي
- `daily_time` → وقت إرسال التقرير
- `daily_timezone` → المنطقة الزمنية
- `weekly_enabled` → تفعيل التقرير الأسبوعي
- `weekly_day` → يوم الإرسال
- `sections_*` → Boolean لكل section في التقرير
- `delivery_telegram` → الإرسال عبر تيليجرام
- `delivery_email` → الإرسال عبر Email

### Table 2: `usage_stats`
**الغرض:** تسجيل الاستخدام اليومي لكل service

**الـ Columns:**
- `id` (UUID, Primary Key)
- `date` (DATE) → التاريخ
- `category` (TEXT) → 'ai', 'telegram', 'reports'
- `metric` (TEXT) → اسم المقياس (مثلاً: tokens_input, messages_sent)
- `value` (INTEGER) → القيمة
- `metadata` (JSONB) → معلومات إضافية
- `created_at` (TIMESTAMP)

**Indexes المطلوبة:**
- `idx_usage_stats_date_category` على (date, category)
- `idx_usage_stats_metric` على (metric)

**أمثلة للـ Metrics:**

**AI:**
- `tokens_input` → عدد input tokens
- `tokens_output` → عدد output tokens
- `requests_success` → عدد الطلبات الناجحة
- `requests_failed` → عدد الطلبات الفاشلة

**Telegram:**
- `messages_sent` → عدد الرسائل المرسلة
- `messages_received` → عدد الرسائل المستقبلة
- `avg_response_time_ms` → متوسط وقت الاستجابة

**Reports:**
- `daily_generated` → عدد التقارير اليومية
- `weekly_generated` → عدد التقارير الأسبوعية

### Table 3: `cost_tracking`
**الغرض:** حساب التكاليف لكل service

**الـ Columns:**
- `id` (UUID, Primary Key)
- `date` (DATE)
- `service` (TEXT) → 'gemini', 'telegram', 'supabase', 'vercel'
- `cost_usd` (DECIMAL(10, 4)) → التكلفة بالدولار
- `details` (JSONB) → تفاصيل إضافية (tokens, pricing rates, etc.)
- `created_at` (TIMESTAMP)

**Pricing Reference:**
- Gemini 1.5 Flash: $0.000075 per 1K input, $0.0003 per 1K output
- Gemini 1.5 Pro: $0.00125 per 1K input, $0.005 per 1K output
- Telegram: Free
- Supabase: Free tier
- Vercel: Hobby plan

### Table 4: `activity_logs`
**الغرض:** تسجيل كل الأحداث في النظام

**الـ Columns:**
- `id` (UUID, Primary Key)
- `timestamp` (TIMESTAMP)
- `level` (TEXT) → 'info', 'warning', 'error', 'success'
- `category` (TEXT) → 'ai', 'telegram', 'reports', 'system', 'config'
- `action` (TEXT) → اسم الـ Action
- `message` (TEXT) → الرسالة
- `metadata` (JSONB) → معلومات إضافية
- `user_id` (TEXT) → NULL للـ system actions

**Indexes المطلوبة:**
- `idx_activity_logs_timestamp` على (timestamp DESC)
- `idx_activity_logs_level` على (level)
- `idx_activity_logs_category` على (category)

**أمثلة للـ Logs:**
- Config change: مين غيّر إيه في الـ config
- AI usage: كل request للـ AI
- Telegram activity: كل رسالة sent/received
- Errors: كل الأخطاء اللي حصلت
- Reports: متى اتولّد كل تقرير

---

## 🎨 **UI Components المطلوبة**

### Component 1: Main Control Panel Page (`/admin/control/page.tsx`)

**الوصف:**
صفحة رئيسية بها Tabs للتنقل بين الأقسام المختلفة

**العناصر المطلوبة:**
1. **Header Section:**
   - عنوان الصفحة: "⚙️ Control Panel"
   - وصف مختصر
   - زر "Export All Data" في أعلى اليمين

2. **Quick Stats Cards (4 cards):**
   - Today's AI Tokens (عدد + نسبة التغيير)
   - Telegram Messages (عدد + نسبة التغيير)
   - Reports Generated (عدد)
   - Estimated Cost (مبلغ بالدولار + التغيير)

3. **Tabs Navigation:**
   - ⚙️ Configurations
   - 📊 Usage & Stats
   - 💰 Cost Analysis
   - 📋 Activity Logs
   - 🧪 Testing Tools

4. **Tab Content Area:**
   - عرض المحتوى حسب الـ Tab المختار
   - استخدام Suspense للـ loading states

**التقنيات:**
- Next.js Server Components للـ initial load
- Client Components للـ interactivity
- Tailwind CSS للـ styling
- shadcn/ui components (optional)

---

### Component 2: Configuration Panel (`ConfigurationPanel.tsx`)

**الوصف:**
Component للتحكم في جميع الـ configurations مع tabs فرعية

**الـ Sub-tabs المطلوبة:**
1. 🤖 AI Configuration
2. 💬 Telegram Configuration
3. 📊 Reports Configuration

**Features مشتركة:**
- Fetch config من API عند التحميل
- Local state للتعديلات
- Save button في الأسفل
- Reset button لإلغاء التغييرات
- Success/Error toasts

#### Sub-tab 1: AI Configuration

**العناصر المطلوبة:**

1. **API Key Display (Read-only):**
   - Input field من نوع password
   - Disabled
   - Value من `.env`
   - رسالة توضيحية: "API keys stored in .env for security"

2. **Model Selection:**
   - Dropdown/Select
   - Options: 
     - Gemini 1.5 Flash (Fast & Cheap)
     - Gemini 1.5 Pro (Accurate & Expensive)
   - عرض السعر تحت كل option

3. **Temperature Slider:**
   - Range input (0 to 1, step 0.1)
   - عرض القيمة الحالية
   - Labels: "0.0 - Precise" و "1.0 - Creative"

4. **Max Tokens Input:**
   - Number input
   - Min: 100, Max: 8192, Step: 100
   - Helper text: "Recommended: 1000-2000 for parsing"

5. **Retry Attempts:**
   - Number input
   - Min: 0, Max: 5

6. **Timeout:**
   - Number input (seconds)
   - Min: 10, Max: 120

#### Sub-tab 2: Telegram Configuration

**العناصر المطلوبة:**

1. **Bot Token Display (Read-only):**
   - مثل API Key (password field, disabled)

2. **Master Toggle:**
   - Switch/Toggle كبير
   - "Enable All Notifications"
   - Background لون مميز (مثلاً أزرق فاتح)

3. **Notification Types:**
   - قائمة من Switches
   - كل نوع في صف منفصل:
     - Project Created
     - Lead Received
     - Report Generated
     - Error Occurred
   - تعطيل الكل إذا Master Toggle مغلق

4. **Quiet Hours:**
   - Toggle للتفعيل
   - عند التفعيل، عرض:
     - Time input للـ start time
     - Time input للـ end time
   - Helper text يوضح الفكرة

5. **Rate Limits:**
   - عنصرين Number input:
     - Per Minute (1-30)
     - Per Hour (10-500)
   - Warning text: "Telegram limit: 30 msg/sec"

#### Sub-tab 3: Reports Configuration

**العناصر المطلوبة:**

1. **Daily Reports Section:**
   - Toggle للتفعيل
   - عند التفعيل:
     - Time input
     - Timezone dropdown (Cairo, UTC, NY, London, Dubai)

2. **Weekly Reports Section:**
   - Toggle للتفعيل
   - عند التفعيل:
     - Day dropdown (Monday-Sunday)
     - Time input

3. **Report Sections:**
   - قائمة من Toggles:
     - Visits
     - Leads
     - Top Projects
     - Competitor Alerts
     - Cost Summary

4. **Delivery Methods:**
   - Telegram: Toggle (enabled)
   - Email: Toggle (disabled مع note "Coming soon")

---

### Component 3: Usage Stats (`UsageStats.tsx`)

**الوصف:**
عرض إحصائيات الاستخدام مع charts تفاعلية وإمكانية Export

**العناصر المطلوبة:**

1. **Header Section:**
   - Date Range Selector:
     - Dropdown: Last 7 Days, Last 30 Days, Last 90 Days, Custom Range
     - إذا Custom: عرض Date pickers (من - إلى)
   - Export CSV Button

2. **Summary Cards (4 cards):**
   - Total AI Tokens (إجمالي + تفصيل input/output)
   - AI Requests (إجمالي + success rate)
   - Telegram Messages (إجمالي + sent/received)
   - Reports Generated (إجمالي + daily/weekly)

3. **Charts Section:**
   
   **Chart 1: AI Token Usage Over Time**
   - Line chart
   - 2 Lines: Input Tokens, Output Tokens
   - X-axis: التواريخ
   - Y-axis: عدد الـ tokens
   
   **Chart 2: Telegram Activity**
   - Bar chart
   - 2 Bars per day: Messages Sent, Messages Received
   - X-axis: التواريخ
   - Y-axis: عدد الرسائل

4. **Detailed Table:**
   - Table headers:
     - Date
     - AI Tokens
     - AI Requests
     - Telegram Messages
     - Reports
   - Sortable columns
   - Pagination (إذا البيانات كتيرة)

**التقنيات:**
- Chart.js أو Recharts للـ charts
- React state للـ date range
- Fetch data من `/api/admin/control/stats`

---

### Component 4: Cost Analysis (`CostAnalysis.tsx`)

**الوصف:**
تحليل التكاليف مع projections ونصائح للتوفير

**العناصر المطلوبة:**

1. **Date Range Selector:**
   - نفس الـ Usage Stats

2. **Total Cost Card (Hero Card):**
   - Background gradient (أزرق)
   - عرض الإجمالي بخط كبير
   - Average per day
   - Text باللون الأبيض

3. **Breakdown Cards (4 cards):**
   - 🤖 Gemini AI:
     - المبلغ
     - النسبة من الإجمالي
     - عدد الـ tokens
   - 💬 Telegram: FREE
   - 🗄️ Supabase: FREE PLAN + الـ usage
   - ▲ Vercel: HOBBY + bandwidth

4. **Projections Section:**
   - Projected Monthly Cost (based on current usage)
   - Projected Yearly Cost

5. **Optimization Tips (Info Box):**
   - Background أصفر فاتح
   - قائمة bullet points:
     - Use Flash instead of Pro
     - Reduce max_tokens
     - Enable caching (coming soon)
     - Set monthly budgets

**التقنيات:**
- Fetch data من `/api/admin/control/costs`
- حساب الـ projections في Frontend أو Backend

---

### Component 5: Activity Logs (`ActivityLogs.tsx`)

**الوصف:**
عرض آخر الأحداث والـ logs بشكل منظم

**العناصر المطلوبة:**

1. **Filters:**
   - Level filter: All, Info, Warning, Error, Success
   - Category filter: All, AI, Telegram, Reports, System, Config
   - Date range (optional)

2. **Logs Table:**
   - Columns:
     - Timestamp
     - Level (مع ألوان: info=blue, warning=yellow, error=red, success=green)
     - Category (مع icons)
     - Message
     - Actions (زر "View Details" إذا فيه metadata)
   - Real-time updates (optional: polling or websockets)

3. **Log Details Modal:**
   - يفتح عند الضغط على "View Details"
   - عرض الـ metadata بشكل JSON formatted

4. **Pagination:**
   - عرض 20-50 log في الصفحة
   - Previous/Next buttons

**التقنيات:**
- Fetch من `/api/admin/control/logs`
- Modal component (shadcn Dialog أو headlessui)

---

### Component 6: Testing Tools (`TestingTools.tsx`)

**الوصف:**
أدوات لاختبار الـ integrations بدون الحاجة لفتح تيليجرام

**العناصر المطلوبة:**

1. **Test AI Parser:**
   - Textarea لإدخال نص
   - Button "Parse"
   - عرض النتيجة (JSON formatted)
   - عرض الوقت المستغرق والـ tokens

2. **Test Telegram Bot:**
   - Input لكتابة رسالة
   - Button "Send to Bot"
   - عرض الرد
   - عرض الـ response time

3. **Trigger Report Manually:**
   - Dropdown لاختيار نوع التقرير (Daily/Weekly)
   - Button "Generate Now"
   - عرض حالة الـ generation
   - Link للـ report المولّد

4. **Check System Health:**
   - Button "Run Health Check"
   - عرض:
     - AI Service: ✅/❌
     - Telegram Bot: ✅/❌
     - Database: ✅/❌
     - Cron Jobs: ✅/❌

**التقنيات:**
- Fetch من API routes مخصصة للـ testing
- Loading states
- Error handling

---

## 🔧 **Backend APIs المطلوبة**

### API 1: Configuration Management (`/api/admin/control/config`)

**Methods:** GET, POST

**GET - Fetch Configuration:**
- Query من database جدول `system_config`
- Group by `category` (ai, telegram, reports)
- Parse الـ JSON values
- Return object منظم بالشكل:
```json
{
  "ai": { "model": "...", "temperature": 0.7, ... },
  "telegram": { "notifications_enabled": true, ... },
  "reports": { "daily_enabled": true, ... }
}
```

**POST - Update Configuration:**
- استقبال الـ config الجديدة
- Loop على كل category وكل key
- Upsert في database (INSERT or UPDATE)
- تسجيل في `activity_logs`
- Return success response

**Error Handling:**
- التأكد من صحة القيم (validation)
- معالجة Database errors
- Return appropriate HTTP status codes

**Security:**
- التأكد من أن المستخدم Admin
- API Keys (من .env) لا ترجع في الـ response

---

### API 2: Usage Statistics (`/api/admin/control/stats`)

**Method:** GET

**Query Parameters:**
- `range` → '7d', '30d', '90d', 'custom'
- `start` → تاريخ البداية (إذا custom)
- `end` → تاريخ النهاية (إذا custom)
- `format` → 'json' أو 'csv' (للتصدير)

**Logic:**
1. حساب الـ date range حسب الـ parameter
2. Query من `usage_stats` جدول
3. Group by date + category + metric
4. حساب الـ aggregations:
   - AI: total tokens, requests, success rate
   - Telegram: messages sent/received
   - Reports: daily/weekly generated
5. تنظيم البيانات في structure مناسب للـ charts

**Response Format (JSON):**
```json
{
  "ai": {
    "total_tokens": 45230,
    "input_tokens": 28000,
    "output_tokens": 17230,
    "requests": 342,
    "success": 338,
    "failed": 4,
    "daily": [
      { "date": "2025-02-17", "input_tokens": 1500, "output_tokens": 800 },
      ...
    ]
  },
  "telegram": {
    "total_messages": 189,
    "sent": 160,
    "received": 29,
    "daily": [...]
  },
  "reports": {...},
  "combined": [
    { "date": "2025-02-17", "ai_tokens": 2300, ... }
  ]
}
```

**CSV Export:**
- إذا `format=csv`، تحويل `combined` array لـ CSV
- Headers: Date, AI Tokens, AI Requests, Telegram Messages, Reports
- Return كـ file download

---

### API 3: Cost Analysis (`/api/admin/control/costs`)

**Method:** GET

**Query Parameters:**
- `range` → '7d', '30d', '90d'

**Logic:**
1. Query من `usage_stats` للـ AI tokens
2. حساب التكلفة based on pricing:
   - Gemini Flash: $0.000075 per 1K input, $0.0003 per 1K output
   - Gemini Pro: $0.00125 per 1K input, $0.005 per 1K output
3. Query من `system_config` لمعرفة Model المستخدم
4. حساب Projections:
   - Average daily cost × 30 = Monthly
   - Monthly × 12 = Yearly
5. جمع بيانات الـ services الأخرى (Telegram, Supabase, Vercel)

**Response Format:**
```json
{
  "total": 0.68,
  "avg_per_day": 0.023,
  "gemini": 0.68,
  "gemini_tokens": 45230,
  "telegram_messages": 189,
  "db_size_mb": 145,
  "bandwidth_gb": 0.5,
  "projected_monthly": 0.69,
  "projected_yearly": 8.28
}
```

---

### API 4: Activity Logs (`/api/admin/control/logs`)

**Method:** GET

**Query Parameters:**
- `level` → 'all', 'info', 'warning', 'error', 'success'
- `category` → 'all', 'ai', 'telegram', 'reports', 'system', 'config'
- `limit` → عدد الـ logs (default: 50)
- `offset` → للـ pagination

**Logic:**
1. Query من `activity_logs`
2. Filter حسب level و category
3. Order by timestamp DESC
4. Limit + Offset للـ pagination
5. Return logs مع metadata

**Response Format:**
```json
{
  "logs": [
    {
      "id": "...",
      "timestamp": "2025-02-17T10:30:00Z",
      "level": "success",
      "category": "ai",
      "action": "project_parsed",
      "message": "Successfully parsed project 'FoodApp'",
      "metadata": { "tokens_used": 450, ... }
    },
    ...
  ],
  "total": 1234,
  "has_more": true
}
```

---

### API 5: Testing Tools (`/api/admin/control/test`)

**Method:** POST

**Body:**
```json
{
  "type": "ai_parser" | "telegram_bot" | "report_generation" | "health_check",
  "data": { ... }
}
```

**ai_parser Test:**
- استقبال text
- Call الـ AI Parser
- Return parsed JSON + tokens used + time taken

**telegram_bot Test:**
- استقبال message
- Send to Telegram Bot
- Return response + response time

**report_generation Test:**
- استقبال report type (daily/weekly)
- Generate report immediately
- Return report content + success status

**health_check Test:**
- Check AI service (ping Gemini API)
- Check Telegram Bot (getMe)
- Check Database (simple query)
- Check Cron Jobs (last execution time)
- Return status for each

---

## 📈 **Usage Tracking Integration**

يجب إضافة tracking في كل الـ services الموجودة:

### في AI Service:
```
كل request للـ Gemini:
- سجل في usage_stats:
  - tokens_input
  - tokens_output
  - requests_success أو requests_failed
- سجل في cost_tracking حسب الـ model المستخدم
- سجل في activity_logs
```

### في Telegram Service:
```
كل message sent أو received:
- سجل في usage_stats:
  - messages_sent
  - messages_received
  - avg_response_time_ms
- سجل في activity_logs
```

### في Reports Service:
```
كل report generated:
- سجل في usage_stats:
  - daily_generated أو weekly_generated
- سجل في activity_logs
```

---

## ⚙️ **Configuration Reading Logic**

يجب تعديل كل الـ services لقراءة الـ config من Database بدلاً من hardcoded values:

### مثال - AI Service:
```
قبل كل AI request:
1. Query من system_config category='ai'
2. استخدم model, temperature, max_tokens من Database
3. إذا فشل الـ query، استخدم default values
4. Cache الـ config لمدة دقيقة (optional)
```

### مثال - Telegram Service:
```
قبل إرسال notification:
1. Check إذا notifications_enabled = true
2. Check نوع الـ notification في notification_types
3. Check إذا الوقت الحالي في quiet_hours
4. Check rate limits
5. إرسال أو تجاهل based on config
```

### مثال - Reports Service:
```
في Cron Job:
1. Query من system_config category='reports'
2. Check إذا daily_enabled = true
3. Check الوقت من daily_time + daily_timezone
4. Check الـ sections المفعّلة
5. Generate report accordingly
```

---

## ✅ **Implementation Checklist**

### Phase 1: Database Setup
- [ ] Create `system_config` table
- [ ] Create `usage_stats` table
- [ ] Create `cost_tracking` table
- [ ] Create `activity_logs` table
- [ ] Insert initial configuration values
- [ ] Create indexes for performance

### Phase 2: Backend APIs
- [ ] Create `/api/admin/control/config` route (GET & POST)
- [ ] Create `/api/admin/control/stats` route
- [ ] Create `/api/admin/control/costs` route
- [ ] Create `/api/admin/control/logs` route
- [ ] Add authentication middleware
- [ ] Test all endpoints

### Phase 3: Frontend Components
- [ ] Create `ConfigurationPanel` component
- [ ] Create `UsageStats` component
- [ ] Create `CostAnalysis` component
- [ ] Create `ActivityLogs` component
- [ ] Create `TestingTools` component
- [ ] Add charts (Chart.js or Recharts)

### Phase 4: Integration
- [ ] Update AI service to read config from DB
- [ ] Update Telegram service to read config from DB
- [ ] Update Reports service to read config from DB
- [ ] Add usage tracking to all services
- [ ] Add cost calculation logic

### Phase 5: Testing
- [ ] Test config changes apply immediately
- [ ] Test stats aggregation is accurate
- [ ] Test CSV export
- [ ] Test date range filters
- [ ] Test responsiveness on mobile

### Phase 6: Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success toasts
- [ ] Add confirm dialogs for critical changes
- [ ] Add tooltips and help text

---

## 🎯 **Success Criteria**

✅ يمكن تعديل أي configuration من الصفحة مباشرة
✅ التغييرات تأخذ effect فوراً بدون restart
✅ API Keys محمية في `.env` وتظهر read-only
✅ الإحصائيات تعرض بدقة مع charts واضحة
✅ يمكن تصدير البيانات كـ CSV
✅ التكلفة محسوبة بدقة لكل service
✅ Activity Logs تسجل كل التغييرات

---

**هل تريد البدء في التنفيذ؟ أو عندك تعديلات على الخطة؟** 🚀
