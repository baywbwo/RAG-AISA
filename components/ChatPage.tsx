import React, { useState, useCallback, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { type Message, User, Conversation } from '../types';
import { streamChat } from '../services/geminiService';

interface ChatPageProps {
  user: User;
  setSidebarOpen: (isOpen: boolean) => void;
  conversation: Conversation;
  onUpdateConversation: (id: string, updatedProps: Partial<Conversation>) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ user, setSidebarOpen, conversation, onUpdateConversation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      parts: [{ text: inputText }],
    };

    const isFirstUserMessage = conversation.messages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirstUserMessage ? inputText.substring(0, 40) + (inputText.length > 40 ? '...' : '') : conversation.title;

    const updatedMessages = [...conversation.messages, userMessage];
    onUpdateConversation(conversation.id, { messages: updatedMessages, title: newTitle });
    
    setIsLoading(true);
    
    const modelResponseId = `model-${Date.now()}`;
    // Add a placeholder for the model's response
    onUpdateConversation(conversation.id, { messages: [...updatedMessages, { id: modelResponseId, role: 'model' as const, parts: [{ text: '' }] }] });

    try {
      const stream = streamChat(inputText, user.nip, conversation.difyConversationId);
      let fullResponse = '';
      let currentDifyId = conversation.difyConversationId;

      for await (const chunk of stream) {
        fullResponse += chunk.textChunk;
        
        if (chunk.conversationId && !currentDifyId) {
          currentDifyId = chunk.conversationId;
          onUpdateConversation(conversation.id, { difyConversationId: currentDifyId });
        }
        
        const currentMessages = [...updatedMessages, { id: modelResponseId, role: 'model' as const, parts: [{ text: fullResponse + '...' }] }];
        onUpdateConversation(conversation.id, { messages: currentMessages });
      }
      
      const finalMessages = [...updatedMessages, { id: modelResponseId, role: 'model' as const, parts: [{ text: fullResponse }] }];
      onUpdateConversation(conversation.id, { messages: finalMessages });

    } catch (error) {
      console.error('Error streaming chat:', error);
      
      let displayMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
          // Check for specific Dify API errors which are embedded in the message
          const apiErrorMatch = error.message.match(/API request failed with status \d+: (.*)/s);
          if (apiErrorMatch && apiErrorMatch[1]) {
              try {
                  const errorJson = JSON.parse(apiErrorMatch[1]);
                  // Use the user-facing 'message' from Dify's JSON response
                  displayMessage = `AISA Service Error: ${errorJson.message || 'The request could not be processed.'}`;
              } catch (e) {
                  // If the error part is not valid JSON, show it as is.
                  displayMessage = `AISA Service Error: ${apiErrorMatch[1]}`;
              }
          } else {
              // For other errors (like network errors), display the message directly.
              displayMessage = error.message;
          }
      }

      const errorMessages = [...updatedMessages, { id: modelResponseId, role: 'model' as const, parts: [{ text: displayMessage }] }];
      onUpdateConversation(conversation.id, { messages: errorMessages });
    } finally {
      setIsLoading(false);
    }
  }, [conversation, onUpdateConversation, user.nip]);
  
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-200 md:justify-end">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 rounded-md md:hidden hover:bg-slate-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
             <h2 className="font-bold text-lg md:hidden">AISA Assistant</h2>
             <div>{/* Placeholder for future controls */}</div>
      </div>
        
      <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          <ChatHistory messages={conversation.messages} />
      </div>

      <div className="p-4 md:p-6 bg-white border-t border-slate-200">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </>
  );
};

export default ChatPage;