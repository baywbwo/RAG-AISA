import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);
  
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    // Clear any session-related data if necessary
  }, []);

  return (
    <div className="w-screen h-screen font-sans text-slate-800">
      {currentUser ? <ChatPage user={currentUser} onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default App;
