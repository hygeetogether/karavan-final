# CaravanShare - Backend

This directory contains the backend source code for the CaravanShare application, a platform for sharing and renting caravans.

## Project Overview

The backend is built with Node.js, Express, and TypeScript. It follows clean architecture principles, separating concerns into distinct layers:

-   **Controllers:** Handle incoming HTTP requests and responses.
-   **Services:** Contain the core business logic of the application.
-   **Repositories:** Abstract the data layer, providing a consistent API for data access.
-   **Models:** Define the data structures for the application's domain.
-   **Container:** Manages dependency injection for singleton services and repositories.

Currently, the backend uses an in-memory data store for rapid prototyping and testing.

## Getting Started

### Prerequisites

-   Node.js (v16 or later)
-   npm

### Installation

1.  Navigate to the `src` directory:
    ```bash
    cd src
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the server with automatic reloading on file changes, run:

```bash
npm run dev
```

The server will be available at `http://localhost:3001`.

### Running Tests

To run the unit and integration test suite, run:

```bash
npm test
```

## API Endpoints

### User Management (`/api/users`)

-   `POST /register`: Register a new user (host or guest).
-   `POST /login`: Log in a user.

### Caravan Management (`/api/caravans`)

-   `POST /`: Create a new caravan (requires host user).
-   `GET /`: Get a list of all caravans.
-   `GET /:id`: Get details for a specific caravan.

### Reservation System (`/api/reservations`)

-   `POST /`: Create a new reservation request.
-   `PATCH /:id/approve`: Approve a pending reservation (host only).
-   `PATCH /:id/reject`: Reject a pending reservation (host only).
-   `PATCH /:id/complete`: Mark an approved reservation as completed.

### Payment System (`/api/payments`)

-   `POST /`: Process a payment for a reservation, which automatically approves it.
-   `GET /history/:userId`: Get the payment history for a specific user.

### Review System (`/api/reviews`)

-   `POST /`: Create a new review for a completed reservation.
