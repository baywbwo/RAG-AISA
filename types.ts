export type UserRole = 'admin' | 'teacher';
export type View = 'chat' | 'admin';

// This is now the single source of truth for the User object structure.
export interface User {
  id: number;
  name: string;
  nip: string; // Used as the username for login
  role: UserRole;
  lastActive: string;
  password?: string; // This is required for authentication and creation
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  id: string;
}