
import React from 'react';
import { type Message } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 18.5 2h0A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 16 19.5v-1.2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.2A2.5 2.5 0 0 1 9.5 22h0A2.5 2.5 0 0 1 7 19.5v-15A2.5 2.5 0 0 1 9.5 2Z" /><path d="M5 2A2.5 2.5 0 0 0 2.5 4.5v15A2.5 2.5 0 0 0 5 22h0a2.5 2.5 0 0 0 2.5-2.5V18a1 1 0 0 1 1-1h1" /><path d="M18.5 2h0A2.5 2.5 0 0 0 16 4.5v1.2a1 1 0 0 1-1 1h-1" />
  </svg>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === 'model';
  const textContent = message.parts.map(part => part.text).join('');

  return (
    <div className={`flex items-start gap-4 ${!isUserModel && 'justify-end'}`}>
      {isUserModel && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-full">
          <BrainIcon className="w-6 h-6 text-emerald-600" />
        </div>
      )}

      <div className={`max-w-xl rounded-2xl p-4 ${isUserModel ? 'bg-white shadow-sm border border-slate-100' : 'bg-emerald-600 text-white'}`}>
        <article className="prose prose-slate max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2">
            <Markdown remarkPlugins={[remarkGfm]}>{textContent}</Markdown>
        </article>
      </div>
      
      {!isUserModel && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full">
          <UserIcon className="w-6 h-6 text-slate-600" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
