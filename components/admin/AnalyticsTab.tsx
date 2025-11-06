import React from 'react';

// Icons
const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.272M15 19.128v-3.86a2.25 2.25 0 0 1 3.375-1.649l2.25 1.313M15 19.128v-3.86a2.25 2.25 0 0 0-3.375-1.649l-2.25 1.313M15 19.128v-3.86a2.25 2.25 0 0 1-3.375-1.649L9.375 12.5M15 19.128v-3.86a2.25 2.25 0 0 0-3.375-1.649L6.375 16.5m2.25 0v-5.117A2.25 2.25 0 0 1 11.25 9.25a2.25 2.25 0 0 1 2.25 2.25v.632M4.5 19.128a9.38 9.38 0 0 1 2.625.372A9.337 9.337 0 0 1 12 21.75c2.682 0 5.141-.959 7.099-2.589m-15.198-2.589A2.25 2.25 0 0 1 6.375 12.5a2.25 2.25 0 0 1 2.25 2.25v.632m0 0v5.117a2.25 2.25 0 0 0 2.25 2.25m0 0a2.25 2.25 0 0 0 2.25-2.25m0 0a2.25 2.25 0 0 0-2.25-2.25m0 0A2.25 2.25 0 0 1 9 11.25a2.25 2.25 0 0 1 2.25-2.25" />
  </svg>
);


const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);


const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
                <UsersIcon className="w-6 h-6 text-blue-600"/>
            </div>
            <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">--</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
             <div className="bg-emerald-100 p-3 rounded-full">
                <ChatBubbleIcon className="w-6 h-6 text-emerald-600"/>
            </div>
            <div>
                <p className="text-sm text-slate-500">Active Conversations Today</p>
                <p className="text-2xl font-bold text-slate-800">--</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
             <div className="bg-amber-100 p-3 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-amber-600"/>
            </div>
            <div>
                <p className="text-sm text-slate-500">Most Frequent Topic</p>
                <p className="text-2xl font-bold text-slate-800">Data Unavailable</p>
            </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-4">Daily Usage Trends</h3>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md text-slate-400">
                Analytics data is not yet available.
            </div>
         </div>
         <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-4">Query Category Breakdown</h3>
             <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md text-slate-400">
                Analytics data is not yet available.
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;