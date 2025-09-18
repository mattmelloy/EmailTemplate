import type { VercelRequest, VercelResponse } from '@vercel/node';
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

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Set CORS headers for all responses
  response.setHeader('Access-Control-Allow-Origin', '*'); // Or lock down to your Vercel URL
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { action, emailBody } = request.body as RequestBody;

    if (!action || !emailBody || !prompts[action]) {
      return response.status(400).json({ error: 'Invalid request body. "action" and "emailBody" are required.' });
    }
    
    // Securely get the API key from Vercel environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return response.status(500).json({ error: 'Server configuration error.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = prompts[action](emailBody);

    const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const revisedText = geminiResponse.text;

    return response.status(200).json({ revisedText });

  } catch (error) {
    console.error('Error in Vercel Function:', error);
    return response.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
}