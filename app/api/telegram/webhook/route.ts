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
            '/add_project - إضافة مشروع جديد\n' +
            '/list_projects - عرض مشاريعك\n' +
            '/analyze_scalability - تحليل التوسع\n' +
            '/morning_brief - ملخص الصباح\n' +
            '/help - عرض هذا التعليمات'
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

        // ... inside POST function ...
        // Handle regular text input (project description)
        else if (text && text.length > 10) {
          console.log("[Webhook] Text is > 10 chars, attempting to parse...");
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
        } else {
          console.log("[Webhook] Text too short (< 10 chars) or unhandled command");
        }
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
          .update({ status: 'published', is_visible: true })
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
