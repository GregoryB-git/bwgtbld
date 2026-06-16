// This should match the role values from your auth system
export type Role = 'Director' | 'Producer' | 'Freelancer' | 'Client';

export interface User {
  id?: string;
  userId?: string;  // add this
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}