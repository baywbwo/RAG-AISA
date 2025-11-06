export type UserRole = 'admin' | 'teacher';

export interface User {
  username: string;
  role: UserRole;
  token: string;
}

export interface Source {
  id: string;
  content: string;
  score: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
