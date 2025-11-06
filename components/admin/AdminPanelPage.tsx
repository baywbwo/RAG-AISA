import React, { useState } from 'react';
import { User } from '../../types';
import UserManagementTab from './UserManagementTab';
import KnowledgeBaseTab from './KnowledgeBaseTab';
import AnalyticsTab from './AnalyticsTab';

// Icons
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.272M15 19.128v-3.86a2.25 2.25 0 0 1 3.375-1.649l2.25 1.313M15 19.128v-3.86a2.25 2.25 0 0 0-3.375-1.649l-2.25 1.313M15 19.128v-3.86a2.25 2.25 0 0 1-3.375-1.649L9.375 12.5M15 19.128v-3.86a2.25 2.25 0 0 0-3.375-1.649L6.375 16.5m2.25 0v-5.117A2.25 2.25 0 0 1 11.25 9.25a2.25 2.25 0 0 1 2.25 2.25v.632M4.5 19.128a9.38 9.38 0 0 1 2.625.372A9.337 9.337 0 0 1 12 21.75c2.682 0 5.141-.959 7.099-2.589m-15.198-2.589A2.25 2.25 0 0 1 6.375 12.5a2.25 2.25 0 0 1 2.25 2.25v.632m0 0v5.117a2.25 2.25 0 0 0 2.25 2.25m0 0a2.25 2.25 0 0 0 2.25-2.25m0 0a2.25 2.25 0 0 0-2.25-2.25m0 0A2.25 2.25 0 0 1 9 11.25a2.25 2.25 0 0 1 2.25-2.25" />
  </svg>
);
const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12.188-2.25.625m2.25-.625a3.375 3.375 0 0 0-3.375-3.375H8.25m9 1.5-2.25.625m2.25-.625a3.375 3.375 0 0 1-3.375-3.375H13.5m0-3.375a3.375 3.375 0 0 0-3.375-3.375H8.25" />
  </svg>
);
const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

type AdminTab = 'users' | 'knowledge' | 'analytics';

interface AdminPanelPageProps {
  user: User;
  setSidebarOpen: (isOpen: boolean) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ user, setSidebarOpen, users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UsersIcon },
    { id: 'knowledge', name: 'Knowledge Base', icon: DocumentTextIcon },
  ];

  return (
    <>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
             <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 rounded-md md:hidden hover:bg-slate-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="text-sm">Welcome, {user.name}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="border-b border-slate-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as AdminTab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === tab.id
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <tab.icon className="w-5 h-5"/>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>
                {activeTab === 'users' && <UserManagementTab users={users} setUsers={setUsers} />}
                {activeTab === 'knowledge' && <KnowledgeBaseTab user={user} />}
                {activeTab === 'analytics' && <AnalyticsTab />}
            </div>
        </div>
    </>
  );
};

export default AdminPanelPage;