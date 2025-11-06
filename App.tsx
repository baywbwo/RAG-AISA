import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import AdminPanelPage from './components/admin/AdminPanelPage';
import Sidebar from './components/Sidebar';
import { User, View, Conversation, Message } from './types';

// The initial user data now lives here as the single source of truth.
const initialUsers: User[] = [
    { id: 1, name: 'Admin User', nip: 'admin', role: 'admin', lastActive: '2024-05-21 10:00', password: 'password' },
    { id: 2, name: 'Budi Santoso', nip: '198503102010011001', role: 'teacher', lastActive: '2024-05-21 09:30', password: 'password' },
    { id: 3, name: 'Citra Lestari', nip: '199008152015032002', role: 'teacher', lastActive: '2024-05-20 15:00', password: 'password' },
    { id: 4, name: 'Dewi Anggraini', nip: '198812012014022005', role: 'teacher', lastActive: '2024-05-19 11:45', password: 'password' },
];

const initialAisaMessage: Message = {
    id: 'initial-aisa-message',
    role: 'model',
    parts: [{ text: "Assalamualaikum, I am AISA. I'm here to help you with lesson planning and other teaching materials. How can I assist you today?" }],
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('chat');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const handleNewChat = useCallback(() => {
    const newId = `chat-${Date.now()}`;
    const newConversation: Conversation = {
        id: newId,
        title: 'New Chat',
        messages: [initialAisaMessage],
        difyConversationId: null,
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    setView('chat');
    setSidebarOpen(false); // Close sidebar on mobile after starting new chat
  }, []);
  
  useEffect(() => {
    // Start a new chat automatically on first login if no chats exist
    if (currentUser && conversations.length === 0) {
        handleNewChat();
    }
  }, [currentUser, conversations, handleNewChat]);

  const handleLoginSuccess = useCallback((user: User) => {
    setCurrentUser(user);
    setView('chat'); 
  }, []);
  
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setConversations([]);
    setActiveConversationId(null);
  }, []);

  const handleUpdateConversation = useCallback((id: string, updatedProps: Partial<Conversation>) => {
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, ...updatedProps } : c)
    );
  }, []);
  
  const handleSwitchConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setView('chat');
    setSidebarOpen(false);
  }, []);

  if (!currentUser) {
    return (
      <div className="w-screen h-screen font-sans text-slate-800">
        <LoginPage onLoginSuccess={handleLoginSuccess} allUsers={users} />
      </div>
    );
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="relative flex w-full h-screen font-sans text-slate-800 bg-slate-50 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onNewChat={handleNewChat} 
        onLogout={handleLogout} 
        userRole={currentUser.role}
        onSwitchView={setView}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSwitchConversation={handleSwitchConversation}
      />
      <main className="flex flex-col flex-1 h-full transition-all duration-300 md:ml-64">
        {view === 'chat' && activeConversation ? (
          <ChatPage 
            key={activeConversation.id}
            user={currentUser}
            setSidebarOpen={setSidebarOpen}
            conversation={activeConversation}
            onUpdateConversation={handleUpdateConversation}
          />
        ) : view === 'admin' ? (
          <AdminPanelPage
            user={currentUser}
            setSidebarOpen={setSidebarOpen}
            users={users}
            setUsers={setUsers}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Select a chat or start a new one.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
