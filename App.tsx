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
  }, []);

  return (
    <div className="w-screen h-screen font-sans text-slate-800">
      {currentUser ? <ChatPage onLogout={handleLogout} user={currentUser} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default App;
