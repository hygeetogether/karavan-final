// src/models/User.ts

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Password should be hashed and not returned in responses
  role: 'host' | 'guest';
  name: string;
  contact: string;
  rating: number; // Average rating from 1-5
  identityVerified: boolean;
  balance?: number; // User's available funds
}
