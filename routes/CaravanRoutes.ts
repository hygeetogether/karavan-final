// src/routes/CaravanRoutes.ts

import { Router } from 'express';
import { createCaravanController } from '../controllers/CaravanController';
import { caravanRepository, userRepository } from '../container';

const router = Router();

// Get dependencies from the container
const caravanController = createCaravanController(caravanRepository, userRepository);

router.post('/', caravanController.createCaravan);
router.get('/', caravanController.getAllCaravans);
router.get('/:id', caravanController.getCaravanById);

export default router;
