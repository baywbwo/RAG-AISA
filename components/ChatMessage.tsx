import React, { useState } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
  );
  

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [sourcesVisible, setSourcesVisible] = useState(false);

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-full">
          <BotIcon className="w-6 h-6 text-emerald-600" />
        </div>
      )}
      <div className="flex flex-col max-w-2xl">
        <div
            className={`p-4 rounded-2xl ${
            isUser
                ? 'bg-emerald-600 text-white rounded-br-none'
                : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100'
            }`}
        >
            <article className="prose prose-sm max-w-none prose-slate prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-table:my-3 prose-blockquote:my-2 prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text || "..."}
              </ReactMarkdown>
            </article>
        </div>
        {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-2 text-xs text-slate-500">
                <button onClick={() => setSourcesVisible(!sourcesVisible)} className="flex items-center gap-1 font-semibold hover:text-slate-800">
                    Sources ({message.sources.length})
                    <ChevronDown className={`w-4 h-4 transition-transform ${sourcesVisible ? 'rotate-180' : ''}`}/>
                </button>
                {sourcesVisible && (
                    <div className="mt-2 space-y-2 border-l-2 border-slate-200 pl-3">
                        {message.sources.map(source => (
                            <div key={source.id} className="bg-slate-100 p-2 rounded-md">
                                <p className="truncate font-medium text-slate-700">Source (Score: {source.score.toFixed(2)})</p>
                                <p className="line-clamp-2 text-slate-600">{source.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full">
          <UserIcon className="w-6 h-6 text-slate-600" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
