// src/routes/CaravanRoutes.ts

import { Router } from 'express';
import { createCaravanController } from '../controllers/CaravanController';
import { caravanService } from '../container';

const router = Router();

// Get dependencies from the container
const caravanController = createCaravanController(caravanService);

router.post('/', caravanController.createCaravan);
router.get('/', caravanController.getAllCaravans);
router.get('/:id', caravanController.getCaravanById);

export default router;
