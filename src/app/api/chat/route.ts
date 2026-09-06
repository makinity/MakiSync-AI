import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are MakiBot, an intelligent and friendly AI assistant representing Mark Vencent Juntilla, a premier AI ADS UGC Creator, Commercial Video Director, and Google Flow AI Pro specialist.

Your goal is to answer visitor questions about Mark, his work, skills, workflow, availability, and services.

Key Information about Mark Vencent Juntilla:
- Role: AI ADS UGC Creator, Commercial Video Director, Generative AI Specialist.
- Specialty Tools: Google Flow AI Pro, Runway Gen-3, Sora, Midjourney, ComfyUI, ElevenLabs, Premiere Pro, CapCut Pro, After Effects.
- Services: AI Video Ads, UGC Commercials, Brand Campaigns, Concept Design, AI Showreels, Post-Production Editing.
- Availability: Available for Q3/Q4 AI Video Campaigns & Brand Collaborations.
- Contact: Visitors can reach out via the Contact section on the website or click "Hire Me".

Instructions:
- Keep answers concise, professional, engaging, and enthusiastic.
- Use clean formatting with bold text where appropriate.
- Direct booking/hiring questions to the "Hire Me" button or contact section.
- Stay in character as MakiBot.`;

// Verified active production models on Groq API
const GROQ_MODELS = [
  'groq/compound',
  'groq/compound-mini',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        role: 'assistant',
        content: `Hi there! I'm **MakiBot**, Mark Vencent Juntilla's AI assistant.\n\n*Note: Groq API key is missing in \`.env.local\` (GROQ_API_KEY).* \n\nIn the meantime, Mark is an **AI Video Creator & Commercial Director** specializing in **Google Flow AI Pro**, Runway, and Next-Gen AI video production. Feel free to explore his portfolio or click **Hire Me** to get in touch!`,
        isFallback: true,
      });
    }

    // Sanitize message array to enforce OpenAI/Groq sequence rules (Must start with 'user')
    const sanitizedMessages = (messages || [])
      .filter((m: any) => m && m.content && !m.isError)
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

    // Remove leading assistant messages so first message is always 'user'
    while (sanitizedMessages.length > 0 && sanitizedMessages[0].role !== 'user') {
      sanitizedMessages.shift();
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({
        role: 'assistant',
        content: 'Please enter a question or message.',
      });
    }

    let lastError: string = '';
    let successData: any = null;

    // Call active Groq models in sequence
    for (const model of GROQ_MODELS) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...sanitizedMessages,
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          successData = await response.json();
          break;
        }

        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message || (await response.text().catch(() => ''));

        console.warn(`Groq model ${model} failed (${response.status}):`, errMsg);
        lastError = errMsg || `HTTP ${response.status}`;

        if (response.status === 401) {
          return NextResponse.json({
            role: 'assistant',
            content: `⚠️ **Groq API Key Error (401)**: Your \`GROQ_API_KEY\` in \`.env.local\` is invalid. Please verify your key at [console.groq.com](https://console.groq.com/).`,
            isError: true,
          });
        }
      } catch (err: any) {
        lastError = err.message || 'Fetch failed';
      }
    }

    if (successData) {
      const assistantMessage = successData.choices?.[0]?.message?.content || "I couldn't generate a response at this time.";
      return NextResponse.json({
        role: 'assistant',
        content: assistantMessage,
      });
    }

    return NextResponse.json({
      role: 'assistant',
      content: `⚠️ **Groq API Request Failed**: ${lastError || 'Unable to connect to Groq models.'}`,
      isError: true,
    });
  } catch (error: any) {
    console.error('Chatbot API route error:', error);
    return NextResponse.json({
      role: 'assistant',
      content: `⚠️ **Server Error**: ${error.message || 'Internal server error'}`,
      isError: true,
    });
  }
}
