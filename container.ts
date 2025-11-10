// src/container.ts

import { UserRepository } from './repositories/UserRepository';
import { CaravanRepository } from './repositories/CaravanRepository';
import { ReservationRepository } from './repositories/ReservationRepository';
import { PaymentRepository } from './repositories/PaymentRepository';
import { ReviewRepository } from './repositories/ReviewRepository';
import { ReservationValidator } from './services/ReservationValidator';
import { ReservationService } from './services/ReservationService';
import { PaymentService } from './services/PaymentService';
import { ReviewService } from './services/ReviewService';

// Create singleton instances of repositories
export const userRepository = new UserRepository();
export const caravanRepository = new CaravanRepository();
export const reservationRepository = new ReservationRepository();
export const paymentRepository = new PaymentRepository();
export const reviewRepository = new ReviewRepository();

// Create instances of services
export const reservationValidator = new ReservationValidator();
export const reservationService = new ReservationService(
  reservationRepository,
  caravanRepository,
  userRepository,
  reservationValidator
);
export const paymentService = new PaymentService(
  userRepository,
  reservationRepository,
  paymentRepository,
  caravanRepository,
  reservationService
);
export const reviewService = new ReviewService(
  reviewRepository,
  reservationRepository,
  userRepository,
  caravanRepository
);

// In a larger application, you might have a more sophisticated container
// that can manage different environments (e.g., test vs. production)
// and handle more complex dependency graphs.
