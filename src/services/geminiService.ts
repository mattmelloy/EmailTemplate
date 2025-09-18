import { AiAction } from '../types';

async function callAiAssistant(
  action: AiAction, 
  emailBody: string, 
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, emailBody }),
  });

  if (!response.ok || !response.body) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred while processing the AI request.' }));
    console.error('Error calling AI assistant API:', errorData);
    throw new Error(errorData.error || `Failed to get response from AI assistant. Status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    console.error("Error reading stream from AI assistant:", error);
    throw new Error("Failed to read the AI's response stream.");
  }
}

export async function correctGrammar(emailBody: string, onChunk: (chunk: string) => void): Promise<void> {
  return callAiAssistant(AiAction.GRAMMAR, emailBody, onChunk);
}

export async function rewriteFriendly(emailBody: string, onChunk: (chunk: string) => void): Promise<void> {
  return callAiAssistant(AiAction.FRIENDLY, emailBody, onChunk);
}

export async function rewriteFormal(emailBody: string, onChunk: (chunk: string) => void): Promise<void> {
  return callAiAssistant(AiAction.FORMAL, emailBody, onChunk);
}
