// src/controllers/CaravanController.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Caravan } from '../models/Caravan';
import { BadRequestError, NotFoundError } from '../errors/HttpErrors';

export const createCaravanController = (caravanRepository: CaravanRepository, userRepository: UserRepository) => {

  const createCaravan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hostId, name, capacity, amenities, location, dailyRate } = req.body;

      if (!hostId || !name || !capacity || !amenities || !location || !dailyRate) {
        throw new BadRequestError('Missing required fields for caravan creation');
      }

      const host = userRepository.findById(hostId);
      if (!host || host.role !== 'host') {
        throw new NotFoundError(`Host with ID ${hostId} not found or is not a host`);
      }

      const newCaravan: Caravan = {
        id: uuidv4(),
        hostId,
        name,
        capacity,
        amenities,
        photos: [], // Photos can be uploaded later
        location,
        status: 'available',
        dailyRate,
      };

      caravanRepository.create(newCaravan);
      res.status(201).json({ message: 'Caravan created successfully', caravan: newCaravan });
    } catch (error) {
      next(error);
    }
  };

  const getCaravanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const caravan = caravanRepository.findById(id);

      if (!caravan) {
        throw new NotFoundError(`Caravan with ID ${id} not found`);
      }

      res.status(200).json(caravan);
    } catch (error) {
      next(error);
    }
  };

  const getAllCaravans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allCaravans = caravanRepository.findAll();
      res.status(200).json(allCaravans);
    } catch (error) {
      next(error);
    }
  };

  return { createCaravan, getCaravanById, getAllCaravans };
};
