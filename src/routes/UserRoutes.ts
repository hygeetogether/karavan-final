// src/routes/UserRoutes.ts

import { Router } from 'express';
import { createUserController } from '../controllers/UserController';
import { userService } from '../container';

const router = Router();

// Get dependencies from the container
const userController = createUserController(userService);

// Define routes
router.post('/register', userController.registerUser);
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

export default router;
