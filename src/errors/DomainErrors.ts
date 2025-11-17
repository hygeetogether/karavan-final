// src/errors/DomainErrors.ts

import { ConflictError, BadRequestError } from './HttpErrors';

export class ReservationConflictError extends ConflictError {
  constructor(message: string = 'The selected dates are not available.') {
    super(message);
  }
}

export class InsufficientFundsError extends BadRequestError {
  constructor(message: string = 'Insufficient funds for this transaction.') {
    super(message);
  }
}

export class InvalidReservationStatusError extends BadRequestError {
  constructor(message: string = 'The operation is not allowed on this reservation due to its current status.') {
    super(message);
  }
}
