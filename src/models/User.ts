// src/models/User.ts

export class User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'host' | 'guest';
  name: string;
  contact: string;
  rating: number;
  identityVerified: boolean;
  balance?: number;

  constructor(
    id: string,
    username: string,
    email: string,
    role: 'host' | 'guest',
    name: string,
    contact: string,
    password?: string,
    balance: number = 0,
    rating: number = 0,
    identityVerified: boolean = false,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.name = name;
    this.contact = contact;
    this.rating = rating;
    this.identityVerified = identityVerified;
    this.balance = balance;
  }

  updateProfile(name: string, contact: string): void {
    this.name = name;
    this.contact = contact;
  }

  verifyIdentity(): void {
    this.identityVerified = true;
  }

  updateBalance(amount: number): void {
    this.balance = (this.balance || 0) + amount;
  }
}
