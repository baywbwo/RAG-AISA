import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import AdminPanelPage from './components/admin/AdminPanelPage';
import Sidebar from './components/Sidebar';
import { User, View } from './types';

// The initial user data now lives here as the single source of truth.
const initialUsers: User[] = [
    { id: 1, name: 'Admin User', nip: 'admin', role: 'admin', lastActive: '2024-05-21 10:00', password: 'password' },
    { id: 2, name: 'Budi Santoso', nip: '198503102010011001', role: 'teacher', lastActive: '2024-05-21 09:30', password: 'password' },
    { id: 3, name: 'Citra Lestari', nip: '199008152015032002', role: 'teacher', lastActive: '2024-05-20 15:00', password: 'password' },
    { id: 4, name: 'Dewi Anggraini', nip: '198812012014022005', role: 'teacher', lastActive: '2024-05-19 11:45', password: 'password' },
];


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('chat');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(Date.now());

  const handleLoginSuccess = useCallback((user: User) => {
    setCurrentUser(user);
    setView('chat'); // Default to chat view on login
  }, []);
  
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleNewChat = useCallback(() => {
    setChatSessionId(Date.now());
    setView('chat');
    setSidebarOpen(false); // Close sidebar on mobile after starting new chat
  }, []);

  if (!currentUser) {
    return (
      <div className="w-screen h-screen font-sans text-slate-800">
        <LoginPage onLoginSuccess={handleLoginSuccess} allUsers={users} />
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-screen font-sans text-slate-800 bg-slate-50 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onNewChat={handleNewChat} 
        onLogout={handleLogout} 
        userRole={currentUser.role}
        onSwitchView={setView}
      />
      <main className="flex flex-col flex-1 h-full transition-all duration-300 md:ml-64">
        {view === 'chat' ? (
          <ChatPage 
            key={chatSessionId}
            user={currentUser}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <AdminPanelPage
            user={currentUser}
            setSidebarOpen={setSidebarOpen}
            users={users}
            setUsers={setUsers}
          />
        )}
      </main>
    </div>
  );
};

export default App;