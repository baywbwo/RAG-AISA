import React, { useState, FormEvent } from 'react';
import { User, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 18.5 2h0A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 16 19.5v-1.2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.2A2.5 2.5 0 0 1 9.5 22h0A2.5 2.5 0 0 1 7 19.5v-15A2.5 2.5 0 0 1 9.5 2Z" /><path d="M5 2A2.5 2.5 0 0 0 2.5 4.5v15A2.5 2.5 0 0 0 5 22h0a2.5 2.5 0 0 0 2.5-2.5V18a1 1 0 0 1 1-1h1" /><path d="M18.5 2h0A2.5 2.5 0 0 0 16 4.5v1.2a1 1 0 0 1-1 1h-1" />
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // This function simulates a call to a backend authentication service.
  const mockAuthService = (u: string, p: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (u.trim() && p) {
          if (p === 'password') { // Mock password check
            const role: NonNullable<UserRole> = u.toLowerCase() === 'admin' ? 'admin' : 'teacher';
            resolve({
              username: u,
              role: role,
              token: `mock-token-for-${u}` // Simulate a session token
            });
          } else {
            reject(new Error('Invalid credentials. Please try again.'));
          }
        } else {
          reject(new Error('Username and password are required.'));
        }
      }, 500); // Simulate network delay
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      // In a real app, you would make a fetch request here.
      // e.g., const user = await fetch('/api/login', ...).then(res => res.json());
      const user = await mockAuthService(username, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-emerald-100 rounded-full">
                <BrainIcon className="w-8 h-8 text-emerald-600"/>
            </div>
          <h1 className="text-3xl font-bold text-slate-900">AISA</h1>
          <p className="text-slate-500">AL-MUSLIM ASSISTANT</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-800 placeholder-slate-400 text-white rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Username / NIP (e.g., 'admin' or 'guru')"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-800 placeholder-slate-400 text-white rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Password (use 'password')"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 disabled:bg-emerald-400 disabled:cursor-wait"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;