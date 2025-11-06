import React from 'react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);


const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
            <XIcon className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Panel</h2>
        <p className="text-slate-600">
          Welcome, Admin. This is where administrative controls and analytics for AISA will be displayed.
          This feature is currently under development. You can add user management, view usage statistics,
          or manage system-wide settings here.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
