// src/controllers/UserController.ts

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, ConflictError, UnauthorizedError } from '../errors/HttpErrors';

// This is a factory function for creating the controller methods.
// It takes the dependencies (the repository) and returns the route handlers.
export const createUserController = (userRepository: UserRepository) => {
  
  const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, role, name, contact } = req.body;

      if (!username || !email || !password || !role || !name || !contact) {
        throw new BadRequestError('All fields are required');
      }

      if (userRepository.findByUsername(username)) {
        throw new ConflictError('Username already exists');
      }

      // In a real application, hash the password
      const newUser: User = {
        id: uuidv4(),
        username,
        email,
        password, // Storing plain text password temporarily
        role,
        name,
        contact,
        rating: 0,
        identityVerified: false,
        balance: 10000, // Set a default balance for simulation
      };

      userRepository.create(newUser);
      console.log('Registered user:', newUser);

      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
      next(error); // Pass errors to the error handling middleware
    }
  };

  const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new BadRequestError('Username and password are required');
      }

      const user = userRepository.findByUsername(username);

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // In a real application, compare hashed password
      if (user.password !== password) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // In a real application, generate a JWT token
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  };

  return { registerUser, loginUser };
};
