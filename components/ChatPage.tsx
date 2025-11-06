import React, { useState, useCallback, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { type Message, User } from '../types';
import { streamChat } from '../services/geminiService';

interface ChatPageProps {
  onLogout: () => void;
  user: User;
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-aisa-message',
      role: 'model',
      parts: [{ text: "Assalamualaikum, I am AISA. I'm here to help you with lesson planning and other teaching materials. How can I assist you today?" }],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      parts: [{ text: inputText }],
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const modelResponseId = `model-${Date.now()}`;
    setMessages(prev => [...prev, { id: modelResponseId, role: 'model', parts: [{ text: '' }] }]);

    try {
      const stream = streamChat(inputText, user.username, conversationId);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.textChunk;
        
        if (chunk.conversationId && !conversationId) {
          setConversationId(chunk.conversationId);
        }

        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelResponseId ? { ...msg, parts: [{ text: fullResponse + '...' }] } : msg
          )
        );
      }
       setMessages(prev =>
          prev.map(msg =>
            msg.id === modelResponseId ? { ...msg, parts: [{ text: fullResponse }] } : msg
          )
        );
    } catch (error) {
      console.error('Error streaming chat:', error);
       setMessages(prev =>
          prev.map(msg =>
            msg.id === modelResponseId ? { ...msg, parts: [{ text: "Sorry, I encountered an error. Please try again." }] } : msg
          )
        );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user.username]);
  
  const handleNewChat = useCallback(() => {
    setMessages([
        {
          id: 'initial-aisa-message',
          role: 'model',
          parts: [{ text: "Assalamualaikum, how can I help you start this new session?" }],
        },
    ]);
    setConversationId(null);
  }, []);

  return (
    <div className="relative flex w-full h-full bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} onNewChat={handleNewChat} onLogout={onLogout} userRole={user.role} />
      <main className="flex flex-col flex-1 h-full transition-all duration-300 md:ml-64">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 md:justify-end">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-600 rounded-md md:hidden hover:bg-slate-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
             <h2 className="font-bold text-lg md:hidden">AISA Assistant</h2>
             <div>{/* Placeholder for future controls */}</div>
        </div>
        
        <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            <ChatHistory messages={messages} />
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-slate-200">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
