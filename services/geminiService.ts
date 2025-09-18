import { AiAction } from '../types';

async function callAiAssistant(action: AiAction, emailBody: string): Promise<string> {
  const response = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, emailBody }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error calling AI assistant API:', errorData);
    throw new Error(errorData.error || `Failed to get response from AI assistant. Status: ${response.status}`);
  }

  const data = await response.json();
  
  if (typeof data?.revisedText !== 'string') {
      console.error('Invalid response from AI function:', data);
      throw new Error('Received an invalid response from the AI assistant.');
  }

  return data.revisedText;
}

export async function correctGrammar(emailBody: string): Promise<string> {
  return callAiAssistant(AiAction.GRAMMAR, emailBody);
}

export async function rewriteFriendly(emailBody: string): Promise<string> {
  return callAiAssistant(AiAction.FRIENDLY, emailBody);
}

export async function rewriteFormal(emailBody: string): Promise<string> {
  return callAiAssistant(AiAction.FORMAL, emailBody);
}
