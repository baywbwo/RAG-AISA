import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewChat: () => void;
  onLogout: () => void;
  userRole: UserRole;
}

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 18.5 2h0A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 16 19.5v-1.2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.2A2.5 2.5 0 0 1 9.5 22h0A2.5 2.5 0 0 1 7 19.5v-15A2.5 2.5 0 0 1 9.5 2Z" /><path d="M5 2A2.5 2.5 0 0 0 2.5 4.5v15A2.5 2.5 0 0 0 5 22h0a2.5 2.5 0 0 0 2.5-2.5V18a1 1 0 0 1 1-1h1" /><path d="M18.5 2h0A2.5 2.5 0 0 0 16 4.5v1.2a1 1 0 0 1-1 1h-1" />
  </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onNewChat, onLogout, userRole }) => {
  return (
    <>
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-slate-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <BrainIcon className="w-8 h-8 text-emerald-600"/>
              <span className="text-xl font-bold">AISA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-600 rounded-md md:hidden hover:bg-slate-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2">
            <button onClick={onNewChat} className="w-full flex items-center gap-3 px-3 py-2 text-slate-900 bg-emerald-100 rounded-md hover:bg-emerald-200 transition-colors font-semibold">
              <PlusIcon className="w-5 h-5"/>
              New Chat
            </button>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
              <HistoryIcon className="w-5 h-5"/>
              History (coming soon)
            </a>
             {userRole === 'admin' && (
               <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                 <SettingsIcon className="w-5 h-5"/>
                 Admin Panel
               </a>
             )}
          </nav>
          
          <div className="p-2 border-t border-slate-200">
             <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
              <LogoutIcon className="w-5 h-5"/>
              Logout
            </button>
          </div>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"></div>}
    </>
  );
};

export default Sidebar;
