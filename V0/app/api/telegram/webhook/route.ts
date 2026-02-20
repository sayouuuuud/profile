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

    // Handle regular messages
    if (update.message) {
      const { chat, text, voice } = update.message;
      const chatId = chat.id;

      if (text) {
        // Handle /add_project command
        if (text === '/add_project' || text?.startsWith('/add_project')) {
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
          await sendMessage(
            chatId,
            '📁 <b>مشاريعك:</b>\n\n' +
            '<i>لا توجد مشاريع مضافة حالياً.</i>\n\n' +
            'استخدم /add_project لإضافة مشروع جديد'
          );
        }
        // Handle regular text input (project description)
        else if (text && text.length > 10) {
          await sendMessage(
            chatId,
            '⏳ <b>جاري معالجة مشروعك...</b>\n\n' +
            'يرجى الانتظار قليلاً... 🔄'
          );

          // Call the parser API
          try {
            const parserResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/ai/parse-project`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  input: text,
                  source: 'text',
                }),
              }
            );

            if (parserResponse.ok) {
              const result = await parserResponse.json() as any;

              if (result.success && result.data) {
                const { title, description, technologies, confidence } = result.data;

                await sendMessage(
                  chatId,
                  '✅ <b>تم استخراج بيانات المشروع:</b>\n\n' +
                  `<b>📌 الاسم:</b> ${title}\n` +
                  `<b>📝 الوصف:</b> ${description}\n` +
                  `<b>🛠 التقنيات:</b> ${technologies.join(', ')}\n` +
                  `<b>🎯 مستوى الثقة:</b> ${confidence}%\n\n` +
                  '<i>هل البيانات صحيحة؟</i>',
                  {
                    inline_keyboard: [
                      [
                        { text: '✅ نعم', callback_data: 'approve_project' },
                        { text: '❌ لا، عدل', callback_data: 'edit_project' },
                      ],
                    ],
                  }
                );
              } else {
                await sendMessage(
                  chatId,
                  '❌ <b>خطأ:</b> لم أتمكن من معالجة النص.\n\n' +
                  'جرب مرة أخرى مع تفاصيل أوضح 📝'
                );
              }
            } else {
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
        }
      }

      // Handle voice messages
      if (voice) {
        await sendMessage(
          chatId,
          '🎙️ <b>تم استقبال الرسالة الصوتية!</b>\n\n' +
          '<i>جاري تحويل الصوت إلى نص...</i>\n' +
          '(هذه الميزة قريباً 🚀)'
        );
      }
    }

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const { id, from, data } = update.callback_query;
      const chatId = from.id;

      if (data === 'approve_project') {
        await sendMessage(
          chatId,
          '🎉 <b>رائع!</b>\n\n' +
          'تم حفظ المشروع بنجاح ✅\n\n' +
          'يمكنك الآن:\n' +
          '• تحليل التوسع باستخدام /analyze_scalability\n' +
          '• إضافة مشروع آخر باستخدام /add_project'
        );
      } else if (data === 'edit_project') {
        await sendMessage(
          chatId,
          '✏️ <b>تحرير المشروع</b>\n\n' +
          'أرسل التعديلات أو المعلومات الإضافية:'
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
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
