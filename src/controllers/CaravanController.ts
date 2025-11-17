// src/controllers/CaravanController.ts

import { Request, Response, NextFunction } from 'express';
import { CaravanService } from '../services/CaravanService';
import { BadRequestError } from '../errors/HttpErrors';

export const createCaravanController = (caravanService: CaravanService) => {

  const createCaravan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, hostId, name, capacity, amenities, photos, location, dailyRate } = req.body;

      if (!id || !hostId || !name || !capacity || !amenities || !location || !dailyRate) {
        throw new BadRequestError('Missing required fields for caravan creation');
      }

      const newCaravan = await caravanService.createCaravan(
        id,
        hostId,
        name,
        capacity,
        amenities,
        photos || [],
        location,
        dailyRate
      );
      
      res.status(201).json({ message: 'Caravan created successfully', caravan: newCaravan });
    } catch (error) {
      next(error);
    }
  };

  const getCaravanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const caravan = await caravanService.getCaravanById(id);
      res.status(200).json(caravan);
    } catch (error) {
      next(error);
    }
  };

  const getAllCaravans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allCaravans = await caravanService.getAllCaravans();
      res.status(200).json(allCaravans);
    } catch (error) {
      next(error);
    }
  };

  return { createCaravan, getCaravanById, getAllCaravans };
};
