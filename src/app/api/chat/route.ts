import { NextRequest, NextResponse } from 'next/server';
import { getPublishedVideos } from '@/lib/supabase';

const BASE_SYSTEM_PROMPT = `You are MakiBot, an intelligent, enthusiastic, and highly knowledgeable AI assistant representing Mark Vencent Juntilla — a premier AI ADS UGC Creator, Commercial Video Director, and Generative AI Specialist.

Your goal is to answer visitor questions about Mark, his background, video creation services, portfolio projects, workflow, AI tools, and availability, and guide potential clients on how to collaborate with him.

=== ABOUT MARK VENCENT JUNTILLA ===
- **Role**: Commercial Video Director, AI Video Ad Creator & Generative AI Specialist.
- **Specialty**: Director-led AI video production bridging cinematic strategy, AI avatar generation, macro product B-roll, and high-converting video ads.
- **Core AI & Production Stack**:
  - **Generative AI Video**: Google Flow AI Pro, Runway Gen-3 Alpha, Luma Dream Machine, Sora, Midjourney v6, Flux.1, ComfyUI.
  - **Voice & Audio**: ElevenLabs (voice cloning & multi-language dubbing), Suno/Udio audio production.
  - **Post-Production & Editing**: Adobe Premiere Pro, After Effects, CapCut Pro (dynamic subtitles, color grading, motion hooks, sound design).

=== SERVICES OFFERED ===
1. **AI UGC Video Commercials (9:16 Vertical)**:
   - High-converting TikTok, Instagram Reels, and YouTube Shorts ads.
   - Photorealistic AI avatars, realistic voiceovers, multi-product B-roll, and viral hook structures.
2. **AI Video Sales Letters & Commercial Ads (16:9 Widescreen)**:
   - High-impact brand story videos, e-commerce product launches, VSL presentations, and luxury brand ads.
3. **AI B-Roll & Visual Asset Generation**:
   - Custom 4K AI-generated macro shots, fluid dynamics, product staging, and cinematic environment renders.
4. **Turnkey End-to-End Production**:
   - Concept development, scriptwriting, AI generation, voiceover sync, motion typography, and final high-res output.

=== WORKFLOW & COLLABORATION ===
- **Turnaround Time**: Standard UGC ads delivered in 48-72 hours. Multi-asset campaign slates in 3-5 business days.
- **Availability**: Currently accepting new Q3/Q4 2026 brand campaigns and agency partnerships.
- **How to Book/Hire**: Visitors can click the "Hire Me" button in the navigation bar or scroll to the Lead Inquiry form on the site to request custom project proposals.

=== INSTRUCTIONS FOR MAKIBOT ===
- Be welcoming, professional, articulate, and passionate about AI video technology.
- Use clean Markdown formatting with bold headers, bullet points, and clear spacing.
- Reference specific portfolio projects when visitors ask about Mark's work or experience.
- If visitors express interest in hiring Mark or getting a quote, warmly invite them to click "Hire Me" or fill out the project brief form on the website.
- Stay strictly in character as MakiBot.`;

// Verified active Groq API models for fast fallback
const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'canopylabs/orpheus-v1-english',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

import fs from 'fs';
import path from 'path';

// Read master knowledge base file dynamically if available
function getMasterKnowledgeBase(): string {
  try {
    const kbPath = path.join(process.cwd(), 'knowledge.md');
    if (fs.existsSync(kbPath)) {
      return fs.readFileSync(kbPath, 'utf8');
    }
  } catch (e) {}
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        role: 'assistant',
        content: `Hi there! I'm **MakiBot**, Mark Vencent Juntilla's AI assistant.\n\n*Note: Groq API key is missing in \`.env.local\` (GROQ_API_KEY).* \n\nMark is an **AI Video Creator & Commercial Director** specializing in **Google Flow AI Pro**, Runway Gen-3, and Next-Gen AI video production. Feel free to explore his portfolio or click **Hire Me** to get in touch!`,
        isFallback: true,
      });
    }

    // Fetch live published portfolio items to provide real-time knowledge to MakiBot
    let liveProjectsKnowledge = '';
    try {
      const projects = await getPublishedVideos();
      if (projects && projects.length > 0) {
        const projectSummaries = projects.map(p => 
          `- **${p.title}** (${p.format || '9:16'}, Category: ${p.category?.name || 'UGC/VSL'}): ${p.description || 'Custom AI video ad campaign'}`
        ).join('\n');
        liveProjectsKnowledge = `\n\n=== LIVE PORTFOLIO PROJECTS (${projects.length} Active Published Campaigns) ===\n${projectSummaries}`;
      }
    } catch (e) {
      console.warn('MakiBot live knowledge sync notice:', e);
    }

    const masterKB = getMasterKnowledgeBase();
    const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${masterKB ? `=== MASTER KNOWLEDGE BASE FILE (knowledge.md) ===\n${masterKB}\n\n` : ''}${liveProjectsKnowledge}`;

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
              { role: 'system', content: fullSystemPrompt },
              ...sanitizedMessages,
            ],
            temperature: 0.7,
            max_tokens: 750,
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
