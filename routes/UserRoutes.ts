// src/routes/UserRoutes.ts

import { Router } from 'express';
import { createUserController } from '../controllers/UserController';
import { userRepository } from '../container';

const router = Router();

// Get dependencies from the container
const userController = createUserController(userRepository);

// Define routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

export default router;
