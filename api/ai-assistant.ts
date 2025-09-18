import { GoogleGenAI } from '@google/genai';
import { AiAction } from '../src/types';

export const config = {
  runtime: 'edge',
};

const prompts = {
  [AiAction.GRAMMAR]: (emailBody: string) => `
You are a professional assistant. Correct grammar, spelling, and punctuation in the following email. Preserve any placeholders that are in the form {PlaceholderName}. Keep the meaning and tone unchanged unless necessary for clarity. Return only the corrected email body (no commentary), including the original HTML formatting.
Email:
---
${emailBody}`,
  [AiAction.FRIENDLY]: (emailBody: string) => `
You are a friendly professional assistant. Rewrite the email below to be friendly and helpful, keeping placeholders like {ClientName} unchanged. Keep content concise and make any phrasing more approachable. Return only the rewritten email body, including the original HTML formatting.
Email:
---
${emailBody}`,
  [AiAction.FORMAL]: (emailBody: string) => `
You are a professional copy editor. Rewrite the email below to be formal and professional, preserving placeholders like {ClientName}. Avoid casual language. Return only the rewritten email body, including the original HTML formatting.
Email:
---
${emailBody}`,
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { action, emailBody } = (await req.json()) as { action: AiAction, emailBody: string };

    if (!action || !emailBody) {
        return new Response(JSON.stringify({ error: 'Missing action or emailBody' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!process.env.API_KEY) {
      console.error('API_KEY not configured on server');
      return new Response(JSON.stringify({ error: 'AI Assistant not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = prompts[action](emailBody);

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in AI assistant handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
