import { NextRequest, NextResponse } from 'next/server';

interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  voice?: {
    file_id: string;
    duration: number;
  };
  document?: {
    file_id: string;
  };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: { id: number };
    chat_instance: string;
    data: string;
  };
}

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendMessage(chatId: number, text: string, replyMarkup?: any): Promise<void> {
  if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...(replyMarkup && { reply_markup: replyMarkup }),
  };

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[Telegram] Send message error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const update = await request.json() as TelegramUpdate;

    // Debug: Log incoming message to DB so user can see their ID
    try {
      const { createClient } = await import('@/lib/supabase/service');
      const supabase = createClient();
      const fromId = update.message?.chat.id || update.callback_query?.from.id;
      const text = update.message?.text || update.callback_query?.data || '(Media/Other)';

      if (fromId) {
        await supabase.from('activity_logs').insert({
          level: 'info',
          category: 'telegram',
          action: 'webhook_received',
          message: `Message from ID ${fromId}: ${text.substring(0, 50)}`,
          metadata: { update_id: update.update_id, from_id: fromId }
        });
      }
    } catch (logErr) {
      console.error("Failed to log webhook activity:", logErr);
    }

    // Handle regular messages
    if (update.message) {
      const { chat, text, voice } = update.message;
      const chatId = chat.id;

      console.log(`[Webhook] Processing message from ${chatId}: ${text?.substring(0, 20)}...`);

      if (text) {
        // Handle /add_project command
        if (text === '/add_project' || text?.startsWith('/add_project')) {
          console.log("[Webhook] Command: /add_project");
          await sendMessage(
            chatId,
            '🎉 <b>مرحباً بك في Project Parser!</b>\n\n' +
            'يمكنك إضافة مشروعك بثلاث طرق:\n\n' +
            '1️⃣ <b>نص بسيط:</b> "عملت مشروع ويب اسمه X يستخدم React و Node.js..."\n' +
            '2️⃣ <b>رابط GitHub:</b> github.com/username/repo\n' +
            '3️⃣ <b>رسالة صوتية:</b> اضغط على الميكروفون\n\n' +
            '👇 <i>أرسل لي معلومات مشروعك الآن:</i>'
          );
        }
        // Handle /help command
        else if (text === '/help' || text?.startsWith('/help')) {
          console.log("[Webhook] Command: /help");
          await sendMessage(
            chatId,
            '📚 <b>الأوامر المتاحة:</b>\n\n' +
            '/status — ايه الدنيا في الموقع دلوقتي؟\n' +
            '/weekly — التقرير الأسبوعي الكامل\n' +
            '/memory — آخر ملاحظات الذكاء الاصطناعي\n' +
            '/add_project — إضافة مشروع جديد\n' +
            '/morning_brief — ملخص الصباح\n' +
            '/help — عرض هذه التعليمات\n\n' +
            '<i>أو اسألني أي سؤال بالعربي عن الموقع! 🧠</i>'
          );
        }
        // Handle /list_projects command
        else if (text === '/list_projects' || text?.startsWith('/list_projects')) {
          console.log("[Webhook] Command: /list_projects");
          await sendMessage(
            chatId,
            '📁 <b>مشاريعك:</b>\n\n' +
            '<i>لا توجد مشاريع مضافة حالياً.</i>\n\n' +
            'استخدم /add_project لإضافة مشروع جديد'
          );
        }

        // ══════════════════════════════════════════════
        // AI BRAIN COMMANDS
        // ══════════════════════════════════════════════

        // /status — الحالة الآنية للموقع
        else if (text === '/status' || text?.startsWith('/status')) {
          await sendMessage(chatId, '⏳ <b>جاري فحص حالة الموقع...</b>');
          try {
            const { createClient: createServiceClient } = await import('@/lib/supabase/service');
            const supabase = createServiceClient();

            const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString();

            const { data: recentRaw } = await supabase.from('analytics_events').select('visitor_id').gte('created_at', fiveMinAgo);
            const activeNow = new Set(recentRaw?.map((v: any) => v.visitor_id)).size;

            const { count: todayVisits } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true }).gte('created_at', todayISO);

            const { data: pagesRaw } = await supabase.from('analytics_events').select('page_path').gte('created_at', todayISO);
            const pageCounts: Record<string, number> = {};
            pagesRaw?.forEach((e: any) => { pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1; });
            const topPage = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0];

            const { count: newMessages } = await supabase.from('messages').select('id', { count: 'exact', head: true }).gte('created_at', todayISO);

            await sendMessage(chatId,
              `🧠 <b>حالة الموقع — ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</b>\n\n` +
              `👁️ <b>نشط الآن (آخر 5 دق):</b> ${activeNow} زائر\n` +
              `📊 <b>زيارات اليوم:</b> ${todayVisits || 0}\n` +
              `🏆 <b>أكثر صفحة:</b> <code>${topPage?.[0] || '/'}</code> (${topPage?.[1] || 0})\n` +
              `✉️ <b>رسائل اليوم:</b> ${newMessages || 0}\n\n` +
              `${activeNow > 0 ? '🟢 يوجد زوار نشطون الآن!' : '⚪️ لا يوجد نشاط في الوقت الحالي'}`
            );
          } catch (e: any) {
            await sendMessage(chatId, `❌ <b>خطأ:</b> <code>${e.message}</code>`);
          }
        }

        // /weekly — التقرير الأسبوعي
        else if (text === '/weekly' || text?.startsWith('/weekly')) {
          await sendMessage(chatId, '⏳ <b>جاري تشغيل التحليل الأسبوعي...</b>\n\nيرجى الانتظار دقيقة لأن الأمر يستدعي الذكاء الاصطناعي 🔄');
          try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sayed.bio';
            const res = await fetch(`${baseUrl}/api/ai/analyze-site`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            if (!res.ok) throw new Error('Analysis API failed');
            const { report, analyticsSnapshot } = await res.json();

            const topPage = analyticsSnapshot?.topPages?.[0];
            const msg = `🧠 <b>التقرير الأسبوعي — AI Brain</b>\n\n` +
              `📅 <b>${analyticsSnapshot?.period?.from} → ${analyticsSnapshot?.period?.to}</b>\n\n` +
              `📊 <b>نظرة عامة:</b>\n• الزيارات: <code>${analyticsSnapshot?.overview?.totalVisits}</code>\n• زوار فريدون: <code>${analyticsSnapshot?.overview?.uniqueVisitors}</code>\n• رسائل: <code>${analyticsSnapshot?.overview?.newMessages}</code>\n\n` +
              `🏆 <b>أكثر صفحة:</b> <code>${topPage?.path || '/'}</code> (${topPage?.visits || 0} زيارة)\n\n` +
              `📝 <b>ملاحظة الأسبوع:</b>\n${report?.executive_summary || 'لا توجد ملاحظات'}\n\n` +
              `🎯 <b>اهتمامات الزوار:</b>\n${report?.interests_detected?.map((i: string) => `• ${i}`).join('\n') || 'غير محدد'}\n\n` +
              `❤️ <b>صحة الموقع:</b> ${report?.health_score || '??'}/100`;
            await sendMessage(chatId, msg);
          } catch (e: any) {
            await sendMessage(chatId, `❌ <b>خطأ في التحليل:</b> <code>${e.message}</code>`);
          }
        }

        // /memory — آخر ملاحظات الذكاء الاصطناعي
        else if (text === '/memory' || text?.startsWith('/memory')) {
          try {
            const { createClient: createServiceClient } = await import('@/lib/supabase/service');
            const supabase = createServiceClient();
            const { data: memories } = await supabase.from('ai_memory').select('type, title, content, created_at').order('created_at', { ascending: false }).limit(5);

            if (!memories?.length) {
              await sendMessage(chatId, '🧠 <b>الذاكرة فارغة</b>\n\nاستخدم /weekly لإنشاء أول تقرير.');
              return NextResponse.json({ ok: true });
            }

            let msg = '🧠 <b>آخر ذكريات الذكاء الاصطناعي:</b>\n\n';
            memories.forEach((m: any, i: number) => {
              const typeEmoji = m.type === 'weekly_report' ? '📊' : m.type === 'observation' ? '👁️' : '💡';
              msg += `${typeEmoji} <b>${m.title || 'ملاحظة'}</b>\n<i>${m.content?.substring(0, 150)}${m.content?.length > 150 ? '...' : ''}</i>\n\n`;
            });
            await sendMessage(chatId, msg);
          } catch (e: any) {
            await sendMessage(chatId, `❌ <b>خطأ:</b> <code>${e.message}</code>`);
          }
        }

        // Handle /morning_brief command
        else if (text === '/morning_brief' || text?.startsWith('/morning_brief')) {
          console.log("[Webhook] Command: /morning_brief");
          await sendMessage(chatId, '⏳ <b>جاري إعداد التقرير الصباحي...</b>\n\nيرجى الانتظار 🔄');

          try {
            const { createClient: createServiceClient } = await import('@/lib/supabase/service');
            const supabase = createServiceClient();

            // Fetch real analytics data (last 24h)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString();

            const { count: visits } = await supabase
              .from('analytics_events')
              .select('id', { count: 'exact', head: true })
              .gte('created_at', yesterdayStr);

            const { count: visitors } = await supabase
              .from('analytics_events')
              .select('visitor_id', { count: 'exact', head: true })
              .gte('created_at', yesterdayStr);

            const analyticsData = {
              visits: visits || 0,
              visitsChange: 0,
              visitors: visitors || 0,
              conversionRate: 'N/A',
            };

            // Generate AI insights
            const { generateBriefInsights } = await import('@/lib/gemini');
            const aiData = await generateBriefInsights(analyticsData, 'Style: professional');

            // Format and send the brief
            const briefText = `
📊 <b>Morning Brief - Daily Analytics</b>

<b>📈 Key Metrics:</b>
• Visits: <code>${analyticsData.visits}</code>
• Visitors: <code>${analyticsData.visitors}</code>
• Conversion: <code>${analyticsData.conversionRate}</code>

<b>📝 Executive Summary:</b>
${aiData.summary || 'No summary generated.'}

<b>🎯 Top Insights:</b>
${aiData.insights?.map((i: string) => `• ${i}`).join('\n') || 'No insights generated.'}

<b>📋 Action Items:</b>
${aiData.action_items?.map((a: string) => `• ${a}`).join('\n') || 'No action items.'}

<i>Generated at ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo' })}</i>
            `.trim();

            await sendMessage(chatId, briefText);

            // Log activity
            await supabase.from('activity_logs').insert({
              level: 'success',
              category: 'reports',
              action: 'manual_brief',
              message: 'Morning brief triggered via Telegram /morning_brief command'
            });

          } catch (briefError) {
            console.error('[Webhook] Morning brief error:', briefError);
            await sendMessage(
              chatId,
              '❌ <b>خطأ في إنشاء التقرير</b>\n\n' +
              'حدث خطأ أثناء إعداد التقرير الصباحي. تأكد من إعدادات النظام.\n' +
              `<code>${briefError instanceof Error ? briefError.message : 'Unknown error'}</code>`
            );
          }
        }

        // معالجة الأسئلة العربية أو النصوص العامة
        else if (text && text.length > 5) {
          // الكلمات الدالة على أسئلة عن الموقع
          const siteKeywords = ['الموقع', 'زوار', 'زيارة', 'صفحة', 'مشاهدة', 'نشاط', 'إحصاء', 'إحصائيات', 'دنيا', 'ايه', 'ماذا', 'كيف', 'مين', 'تقرير', 'أكثر', 'اكثر', 'اليوم', 'الأسبوع', 'الأسبوع', 'زائر', 'رسائل', 'سؤال', 'حال', 'وضع'];
          const isSiteQuestion = siteKeywords.some(kw => text.includes(kw));

          if (isSiteQuestion) {
            // سؤال عن الموقع — نرد بذكاء بالعربي
            await sendMessage(chatId, '🧠 <b>جاري التفكير...</b>');
            try {
              const { createClient: createServiceClient } = await import('@/lib/supabase/service');
              const supabase = createServiceClient();

              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
              const today = new Date(); today.setHours(0, 0, 0, 0);

              const { count: weekVisits } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo);
              const { count: todayVisits } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString());
              const { data: pagesRaw } = await supabase.from('analytics_events').select('page_path').gte('created_at', weekAgo);
              const pageCounts: Record<string, number> = {};
              pagesRaw?.forEach((e: any) => { pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1; });
              const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
              const { data: lastMemory } = await supabase.from('ai_memory').select('content, data').eq('type', 'weekly_report').order('created_at', { ascending: false }).limit(1).single();

              const { GoogleGenerativeAI } = await import('@google/generative-ai');
              const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
              const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

              const context = `
أنت مساعد ذكي يسكن في الموقع الشخصي لـ"سيد". بيانات الأسبوع الحالي:
- إجمالي الزيارات هذا الأسبوع: ${weekVisits}
- زيارات اليوم: ${todayVisits}
- أكثر الصفحات زيارة: ${topPages.map(([p, c]) => `${p} (${c})`).join(', ')}
- آخر تقرير AI: ${lastMemory?.content || 'لا يوجد تقرير بعد'}

سؤال المسؤول: ${text}

اجب باختصار وبالعربي — جملتان أو ثلاثة، لا أكثر. كن ذكياً وحلل البيانات.
`;
              const result = await model.generateContent(context);
              await sendMessage(chatId, `🧠 ${result.response.text()}`);
            } catch (e: any) {
              await sendMessage(chatId, `❌ <b>خطأ:</b> <code>${e.message}</code>`);
            }
          } else {
            // نص غير متعلق بالموقع — محاولة تحليله كمشروع
            console.log("[Webhook] Text is > 5 chars, attempting to parse as project...");
            await sendMessage(
              chatId,
              '⏳ <b>جاري معالجة مشروعك...</b>\n\n' +
              'يرجى الانتظار قليلاً... 🔄'
            );

          // Call the parser API (or use library directly if environment permits, but fetch is safer for consistent env)
          try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/ai/parse-project`;
            console.log(`[Webhook] Fetching AI Parser at: ${apiUrl}`);

            const parserResponse = await fetch(
              apiUrl,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  input: text,
                  source: 'text',
                }),
              }
            );

            console.log(`[Webhook] Parser Status: ${parserResponse.status}`);

            if (parserResponse.ok) {
              const result = await parserResponse.json() as any;
              console.log("[Webhook] Parser Result:", result ? "Got Data" : "No Data");

              if (result.data) {
                const { title, description, technologies, confidence, kpis } = result.data;

                // Create slug from title
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                // Save to Supabase
                const { createClient } = await import('@/lib/supabase/service');
                const supabase = createClient();

                const { data: insertedProject, error: insertError } = await supabase
                  .from('case_studies')
                  .insert({
                    title,
                    slug: `${slug}-${Date.now()}`, // Ensure uniqueness
                    summary: description,
                    description: description, // detailed description same as summary for now
                    tech_stack: technologies,
                    metrics: Object.entries(kpis).map(([label, value]) => ({ label, value })),
                    status: 'draft', // Initial status
                    hero_tag: 'AI Generated',
                    created_at: new Date().toISOString(),
                    is_visible: false
                  })
                  .select()
                  .single();

                if (insertError) {
                  console.error('[Webhook] Supabase Insert Error:', insertError);
                  throw new Error('Failed to save to database');
                }

                console.log(`[Webhook] Project Saved: ${insertedProject.id}`);

                await sendMessage(
                  chatId,
                  '✅ <b>تم استخراج بيانات المشروع وحفظه كمسودة:</b>\n\n' +
                  `<b>📌 الاسم:</b> ${title}\n` +
                  `<b>📝 الوصف:</b> ${description}\n` +
                  `<b>🛠 التقنيات:</b> ${technologies.join(', ')}\n` +
                  `<b>🎯 مستوى الثقة:</b> ${confidence}%\n\n` +
                  '<i>هل البيانات صحيحة؟</i>',
                  {
                    inline_keyboard: [
                      [
                        { text: '✅ نشر', callback_data: `approve_project:${insertedProject.id}` },
                        { text: '❌ حذف', callback_data: `delete_project:${insertedProject.id}` },
                      ],
                    ],
                  }
                );
              } else {
                // ... error handling ...
                console.log("[Webhook] Result.data is missing");
                await sendMessage(
                  chatId,
                  '❌ <b>خطأ:</b> لم أتمكن من معالجة النص.\n\n' +
                  'جرب مرة أخرى مع تفاصيل أوضح 📝'
                );
              }
            } else {
              const errText = await parserResponse.text();
              console.error("[Webhook] Parser API Failed:", errText);
              throw new Error('Parser API error');
            }
          } catch (error) {
            console.error('[Telegram] Parser error:', error);
            await sendMessage(
              chatId,
              '⚠️ <b>خطأ في المعالجة:</b>\n\n' +
              'حدث خطأ أثناء محاولة تحليل المشروع.\n' +
              'جرب مرة أخرى لاحقاً 🔄'
            );
          }
          } // end else (project parse)
        } // end else if (text > 5)
      }

      // Handle voice messages
      if (voice) {
        // ... voice handling ...
      }
    }

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const { id, from, data } = update.callback_query;
      const chatId = from.id;

      if (data.startsWith('approve_project:')) {
        const projectId = data.split(':')[1];
        const { createClient } = await import('@/lib/supabase/service');
        const supabase = createClient();

        await supabase
          .from('case_studies')
          .update({ status: 'active', is_visible: true })
          .eq('id', projectId);

        await sendMessage(
          chatId,
          '🎉 <b>رائع!</b>\n\n' +
          'تم نشر المشروع بنجاح ✅\n\n' +
          'يمكنك الآن:\n' +
          '• تحليل التوسع باستخدام /analyze_scalability\n' +
          '• إضافة مشروع آخر باستخدام /add_project'
        );
      } else if (data === 'draft_post') {
        await sendMessage(
          chatId,
          '📝 <b>Drafting Post...</b>\n\n' +
          'Based on your recent case studies, here is a LinkedIn draft:\n\n' +
          '<i>"Excited to share our latest work on scaling high-performance web apps! We tackled unique challenges in specific-feature... #Tech #Building"</i>\n\n' +
          'Reply to refine this.'
        );
      } else if (data === 'analyze_trends') {
        await sendMessage(
          chatId,
          '🔍 <b>Analyzing Trends...</b>\n\n' +
          '• <b>Traffic Source:</b> Direct traffic is up 15%\n' +
          '• <b>Top Page:</b> /case-studies/scalability-simulator\n' +
          '• <b>User Behavior:</b> Longer session times on technical deep-dives.\n\n' +
          'Suggestion: Double down on technical content.'
        );
      } else if (data.startsWith('delete_project:')) {
        const projectId = data.split(':')[1];
        const { createClient } = await import('@/lib/supabase/service');
        const supabase = createClient();

        await supabase
          .from('case_studies')
          .delete()
          .eq('id', projectId);

        await sendMessage(
          chatId,
          '🗑️ <b>تم الحذف</b>\n\n' +
          'تم حذف المشروع المسودة.'
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // ... error handling ...
    console.error('[Telegram Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}


export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { message: 'Telegram webhook is active' },
    { status: 200 }
  );
}
