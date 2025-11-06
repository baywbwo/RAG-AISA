export type UserRole = 'admin' | 'teacher' | null;

// Add a User interface for session management
export interface User {
  username: string;
  role: NonNullable<UserRole>; // Role cannot be null when logged in
  // In a real app, this would be a JWT or similar
  token: string; 
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  id: string;
}
