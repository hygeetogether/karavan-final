// src/controllers/UserController.ts

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { BadRequestError } from '../errors/HttpErrors';

export const createUserController = (userService: UserService) => {
  
  const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, username, email, password, role, name, contact } = req.body;

      if (!id || !username || !email || !password || !role || !name || !contact) {
        throw new BadRequestError('All fields are required');
      }

      const user = await userService.createUser(id, username, email, password, role, name, contact);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error);
    }
  };

  const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  // Note: A login method would also be here, likely in the UserService,
  // handling password verification and JWT generation.
  // For simplicity, we've omitted it from this refactoring.

  return { registerUser, getUserById, getAllUsers };
};
