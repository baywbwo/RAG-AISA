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

// Icon moved here for use in the Welcome Screen
const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 18.5 2h0A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 16 19.5v-1.2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.2A2.5 2.5 0 0 1 9.5 22h0A2.5 2.5 0 0 1 7 19.5v-15A2.5 2.5 0 0 1 9.5 2Z" /><path d="M5 2A2.5 2.5 0 0 0 2.5 4.5v15A2.5 2.5 0 0 0 5 22h0a2.5 2.5 0 0 0 2.5-2.5V18a1 1 0 0 1 1-1h1" /><path d="M18.5 2h0A2.5 2.5 0 0 0 16 4.5v1.2a1 1 0 0 1-1 1h-1" />
  </svg>
);


const ChatPage: React.FC<ChatPageProps> = ({ onLogout, user }) => {
  // Initial state is now an empty array, no more hardcoded message.
  const [messages, setMessages] = useState<Message[]>([]);
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
    // Add a placeholder for the model's response
    setMessages(prev => [...prev, { id: modelResponseId, role: 'model', parts: [{ text: '' }] }]);

    try {
      const stream = streamChat(inputText, user.username, conversationId);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.textChunk;
        
        if (chunk.conversationId && !conversationId) {
          setConversationId(chunk.conversationId);
        }

        // Update the placeholder with streaming text
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelResponseId ? { ...msg, parts: [{ text: fullResponse + '...' }] } : msg
          )
        );
      }
      // Finalize the message without the ellipsis
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
  
  // New chat now just clears the messages and conversationId
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  const handleExamplePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex items-center justify-center w-24 h-24 mb-6 bg-emerald-100 rounded-full">
                <BrainIcon className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Assalamualaikum, I am AISA</h2>
              <p className="max-w-md mt-2 text-slate-500">
                Your personal assistant for lesson planning. Start by asking me a question.
              </p>
              <div className="mt-8 w-full max-w-2xl text-left">
                  <p className="text-sm font-semibold text-center text-slate-400 mb-2">Or try one of these examples:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button onClick={() => handleExamplePromptClick("Buatkan RPP tentang siklus air untuk kelas 5 SD")} className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">"Buatkan RPP tentang siklus air untuk kelas 5 SD"</button>
                    <button onClick={() => handleExamplePromptClick("Berikan ide kegiatan ice breaking untuk pelajaran matematika")} className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">"Berikan ide kegiatan ice breaking untuk pelajaran matematika"</button>
                  </div>
              </div>
            </div>
          ) : (
            <ChatHistory messages={messages} />
          )}
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-slate-200">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;