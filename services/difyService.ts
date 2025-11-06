import { Message, Source } from '../types';

const API_KEY = 'app-ECMWJKh7ExkqWXulCtSibHPZ'; // Dify API Key
const API_URL = 'https://api.dify.ai/v1/chat-messages';

interface StreamDifyResponseParams {
  prompt: string;
  history: Message[];
  conversationId: string | null;
  onChunk: (chunk: string) => void;
  onComplete: (finalState: { conversationId: string; sources: Source[] }) => void;
}

export const streamDifyResponse = async ({
  prompt,
  history,
  conversationId,
  onChunk,
  onComplete,
}: StreamDifyResponseParams): Promise<void> => {
  const body = {
    inputs: {},
    query: prompt,
    user: 'aisa-user',
    response_mode: 'streaming',
    conversation_id: conversationId || '',
    // file_ids: [], // If you need to upload files
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API Error:', errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalConversationId = conversationId || '';
    let sources: Source[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last, possibly incomplete line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          try {
            const data = JSON.parse(jsonStr);
            
            if (data.event === 'message') {
              onChunk(data.answer);
            } else if (data.event === 'message_end') {
              finalConversationId = data.conversation_id;
              if (data.metadata && data.metadata.retriever_resources) {
                sources = data.metadata.retriever_resources.map((res: any) => ({
                    id: res.document_id,
                    content: res.content,
                    score: res.score,
                }));
              }
            }
          } catch (e) {
            console.error('Error parsing stream data:', e);
          }
        }
      }
    }
    onComplete({ conversationId: finalConversationId, sources });
  } catch (error) {
    console.error('Failed to fetch from Dify API:', error);
    throw error;
  }
};
