// This is a Vercel Serverless Function, equivalent to an API endpoint.
// It must be placed in the /api directory.

import { GoogleGenAI } from "@google/genai";

// Define the structure of the incoming request body
interface RequestBody {
  action: 'grammar' | 'friendly' | 'formal';
  emailBody: string;
}

// Define prompts in a structured way
const prompts = {
  grammar: (emailBody: string) => `
You are a professional assistant. Correct grammar, spelling, and punctuation in the following email. Preserve any placeholders that are in the form {PlaceholderName}. Keep the meaning and tone unchanged unless necessary for clarity. Return only the corrected email body (no commentary).
Email:
---
${emailBody}`,
  friendly: (emailBody: string) => `
You are a friendly professional assistant. Rewrite the email below to be friendly and helpful, keeping placeholders like {ClientName} unchanged. Keep content concise and make any phrasing more approachable. Return only the rewritten email body.
Email:
---
${emailBody}`,
  formal: (emailBody: string) => `
You are a professional copy editor. Rewrite the email below to be formal and professional, preserving placeholders like {ClientName}. Avoid casual language. Return only the rewritten email body.
Email:
---
${emailBody}`,
};

export default async function handler(request: Request, response: Response) {
    // Handle CORS preflight request for development (Vercel handles this in production)
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
    }

    try {
        const { action, emailBody } = (await request.json()) as RequestBody;

        if (!action || !emailBody || !prompts[action]) {
            return new Response(JSON.stringify({ error: 'Invalid request body. "action" and "emailBody" are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Securely get the API key from Vercel environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not set in environment variables.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        const prompt = prompts[action](emailBody);

        const geminiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const revisedText = geminiResponse.text;

        return new Response(JSON.stringify({ revisedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in Vercel Function:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
