// This service now connects to the Dify.ai API as requested.
// All previous Gemini API logic has been removed.

// In a production app, these should be stored in environment variables.
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';
const DIFY_UPLOAD_URL = 'https://api.dify.ai/v1/files/upload';
const DIFY_API_KEY = 'app-ECMWJKh7ExkqWXulCtSibHPZ';

/**
 * The expected structure of a chunk of data from the Dify streaming API.
 * Example: data: {"event": "message", "answer": "Hello", "conversation_id": "123-abc"}
 */
interface DifyStreamChunk {
    event: string;
    answer?: string;
    conversation_id?: string;
}

/**
 * The object yielded by the generator for each piece of the response.
 */
export interface ChatStreamResponse {
    textChunk: string;
    conversationId: string | null;
}

export async function* streamChat(
  prompt: string,
  user: string, // A unique identifier for the end-user.
  conversationId: string | null,
): AsyncGenerator<ChatStreamResponse> {
  
  const body: { [key: string]: any } = {
    inputs: {},
    query: prompt,
    user: user,
    response_mode: 'streaming',
  };

  if (conversationId) {
    body['conversation_id'] = conversationId;
  }
  
  try {
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Dify API Error:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedData = '';
    let currentConversationId: string | null = conversationId;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      
      accumulatedData += decoder.decode(value, { stream: true });
      
      const lines = accumulatedData.split('\n');
      accumulatedData = lines.pop() || '';

      for (const line of lines) {
          if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6);
              if (jsonStr) {
                  try {
                      const chunk: DifyStreamChunk = JSON.parse(jsonStr);
                      
                      if (chunk.conversation_id && !currentConversationId) {
                          currentConversationId = chunk.conversation_id;
                      }

                      if (chunk.event === 'message' && chunk.answer) {
                          yield {
                              textChunk: chunk.answer,
                              conversationId: currentConversationId,
                          };
                      }
                  } catch(e) {
                      console.error("Failed to parse stream chunk JSON:", jsonStr, e);
                  }
              }
          }
      }
    }

  } catch (error) {
    console.error("Error in streamChat (Dify):", error);
    yield {
        textChunk: "I'm sorry, but I've encountered an error connecting to the chat service. Please try again later.",
        conversationId: null
    };
  }
}

/**
 * Uploads a file to the Dify knowledge base.
 * @param file The file object to upload.
 * @param user A unique identifier for the end-user performing the upload.
 * @returns The JSON response from the Dify API on successful upload.
 */
export async function uploadDocumentToDify(file: File, user: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user', user);

  try {
    const response = await fetch(DIFY_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (!response.ok) {
      console.error("Dify Upload API Error:", responseJson);
      throw new Error(responseJson.message || `File upload failed with status ${response.status}`);
    }

    return responseJson;
  } catch (error) {
    console.error("Error in uploadDocumentToDify:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unexpected error occurred during file upload.");
  }
}
