import React from 'react';
import { User, Conversation } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onOpenAdminPanel: () => void;
}

const LogOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const PanelRightOpen: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></svg>
);

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, setIsOpen, conversations, activeConversationId, onNewChat, onSelectConversation, onOpenAdminPanel }) => {
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-full shadow-md text-slate-800">
        {isOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
      </button>
      <aside className={`fixed top-0 left-0 z-20 w-64 h-full bg-white text-slate-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AISA</h1>
            <p className="text-sm text-slate-500">AL-MUSLIM ASSISTANT</p>
          </div>
        </div>
        <div className="p-4">
            <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                <PlusIcon className="w-5 h-5"/>
                <span>New Chat</span>
            </button>
        </div>
        <nav className="flex-1 p-4 pt-0 space-y-1 overflow-y-auto">
            <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">History</h3>
            {conversations.map((convo) => (
                <a
                    key={convo.id}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onSelectConversation(convo.id); }}
                    className={`block w-full text-left truncate px-3 py-2 text-sm rounded-md transition-colors ${
                        activeConversationId === convo.id
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {convo.title}
                </a>
            ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 space-y-4">
            {user.role === 'admin' && (
                <button
                    onClick={onOpenAdminPanel}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
                >
                    <PanelRightOpen className="w-5 h-5"/>
                    <span>Admin Panel</span>
                </button>
            )}
             <div className="px-1 text-slate-600">Welcome, <span className="font-semibold text-slate-800">{user.username}</span>! <span className="text-xs text-slate-500 capitalize">({user.role})</span></div>
            <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
            <LogOutIcon className="w-5 h-5"/>
            <span>Logout</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;