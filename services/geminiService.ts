
import { GoogleGenAI } from "@google/genai";

// Fix: Refactored to align with @google/genai SDK guidelines.
// The API key is sourced directly from `process.env.API_KEY` and is assumed to be set.
// Removed manual API key checks and mock responses.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI model.");
  }
}

export async function correctGrammar(emailBody: string): Promise<string> {
  const prompt = `
You are a professional assistant. Correct grammar, spelling, and punctuation in the following email. Preserve any placeholders that are in the form {PlaceholderName}. Keep the meaning and tone unchanged unless necessary for clarity. Return only the corrected email body (no commentary).
Email:
---
${emailBody}`;
  return callGemini(prompt);
}

export async function rewriteFriendly(emailBody: string): Promise<string> {
  const prompt = `
You are a friendly professional assistant. Rewrite the email below to be friendly and helpful, keeping placeholders like {ClientName} unchanged. Keep content concise and make any phrasing more approachable. Return only the rewritten email body.
Email:
---
${emailBody}`;
  return callGemini(prompt);
}

export async function rewriteFormal(emailBody: string): Promise<string> {
  const prompt = `
You are a professional copy editor. Rewrite the email below to be formal and professional, preserving placeholders like {ClientName}. Avoid casual language. Return only the rewritten email body.
Email:
---
${emailBody}`;
  return callGemini(prompt);
}
