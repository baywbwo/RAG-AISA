import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import AdminPanel from './AdminPanel';
import { User, Message, Conversation, Source } from '../types';
import { streamDifyResponse } from '../services/difyService';

interface ChatPageProps {
  user: User;
  onLogout: () => void;
}

const WelcomeScreen: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
  const examplePrompts = [
    "Buatkan saya RPP tentang siklus air untuk kelas 4 SD",
    "Jelaskan konsep fotosintesis dengan analogi sederhana",
    "Ide kegiatan ice breaking untuk pelajaran matematika",
    "Rekomendasi penilaian formatif untuk materi sejarah",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-emerald-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 18.5 2h0A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 16 19.5v-1.2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.2A2.5 2.5 0 0 1 9.5 22h0A2.5 2.5 0 0 1 7 19.5v-15A2.5 2.5 0 0 1 9.5 2Z" /><path d="M5 2A2.5 2.5 0 0 0 2.5 4.5v15A2.5 2.5 0 0 0 5 22h0a2.5 2.5 0 0 0 2.5-2.5V18a1 1 0 0 1 1-1h1" /><path d="M18.5 2h0A2.5 2.5 0 0 0 16 4.5v1.2a1 1 0 0 1-1 1h-1" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-800">AISA is ready to help!</h1>
      <p className="mt-2 text-slate-500 max-w-md">Ask me anything about lesson planning, curriculum development, or educational strategies.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
        {examplePrompts.map((prompt) => (
          <button key={prompt} onClick={() => onPromptClick(prompt)} className="p-4 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg text-left text-sm">
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};


const ChatPage: React.FC<ChatPageProps> = ({ user, onLogout }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    const savedConversations = localStorage.getItem('aisa-conversations');
    if (savedConversations) {
      const parsedConvos = JSON.parse(savedConversations) as Conversation[];
      // Ensure timestamps are Date objects
      parsedConvos.forEach(convo => {
        convo.messages.forEach(msg => msg.timestamp = new Date(msg.timestamp));
      });
      setConversations(parsedConvos);
      if (parsedConvos.length > 0) {
        setActiveConversationId(parsedConvos[0].id);
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('aisa-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const updateConversation = useCallback((convoId: string, updateFn: (convo: Conversation) => Conversation) => {
    setConversations(prev =>
      prev.map(c => (c.id === convoId ? updateFn(c) : c))
    );
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    let currentConversationId = activeConversationId;

    // Create a new conversation if there isn't one
    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: `convo-${Date.now()}`,
        title: text.substring(0, 30) + '...',
        messages: [],
      };
      setConversations(prev => [newConversation, ...prev]);
      currentConversationId = newConversation.id;
      setActiveConversationId(newConversation.id);
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`, text, sender: 'user', timestamp: new Date()
    };
    
    // Use a function for setting state to ensure we're updating the correct conversation
    setConversations(prev => prev.map(c => 
      c.id === currentConversationId 
      ? { ...c, messages: [...c.messages, userMessage] } 
      : c
    ));
    
    setIsLoading(true);

    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId, text: '', sender: 'assistant', timestamp: new Date(), sources: []
    };
    
    setConversations(prev => prev.map(c =>
      c.id === currentConversationId
      ? { ...c, messages: [...c.messages, assistantMessage] }
      : c
    ));

    const conversationHistory = conversations.find(c => c.id === currentConversationId)?.messages.slice(0, -1) || [];
    const difyConversationId = localStorage.getItem(`dify-convo-${currentConversationId}`) || null;

    try {
      await streamDifyResponse({
        prompt: text,
        history: conversationHistory,
        conversationId: difyConversationId,
        onChunk: (chunk) => {
            updateConversation(currentConversationId!, convo => ({
                ...convo,
                messages: convo.messages.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, text: msg.text + chunk } : msg
                ),
            }));
        },
        onComplete: (finalState) => {
            if (finalState.conversationId) {
                localStorage.setItem(`dify-convo-${currentConversationId!}`, finalState.conversationId);
            }
            updateConversation(currentConversationId!, convo => ({
                ...convo,
                messages: convo.messages.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, sources: finalState.sources } : msg
                ),
            }));
        }
      });
    } catch (error) {
      console.error("Error streaming response:", error);
      updateConversation(currentConversationId!, convo => ({
        ...convo,
        messages: convo.messages.map(msg => 
            msg.id === assistantMessageId ? { ...msg, text: "Sorry, I encountered an error. Please try again." } : msg
        ),
      }));
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, conversations, updateConversation]);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const handleSelectConversation = useCallback((convoId: string) => {
    setActiveConversationId(convoId);
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        user={user}
        onLogout={onLogout}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />
      <main className="flex-1 flex flex-col md:ml-64">
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto h-full">
            {activeConversation && activeConversation.messages.length > 0 ? (
                <ChatHistory messages={activeConversation.messages} />
            ) : (
                user.role !== 'admin' && <WelcomeScreen onPromptClick={handleSendMessage} />
            )}
          </div>
        </div>
        {user.role !== 'admin' && (
          <div className="p-6 md:p-10 border-t bg-white/80 backdrop-blur-md sticky bottom-0">
            <div className="max-w-4xl mx-auto">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        )}
      </main>
      {user.role === 'admin' && <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />}
    </div>
  );
};

export default ChatPage;
