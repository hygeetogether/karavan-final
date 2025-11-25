# CaravanShare

CaravanShare is a peer-to-peer caravan sharing platform that allows users to list their caravans and others to book them for their next adventure.

## Features

- **User Accounts**: Sign up as a Guest or Host.
- **Caravan Listings**: Hosts can list caravans with photos, amenities, and pricing.
- **Search & Filter**: Guests can search for caravans by location and price.
- **Reservations**: Guests can book caravans for specific dates.
- **Payments**: Mock payment integration to confirm bookings.
- **Reviews**: Guests can leave reviews and ratings for caravans.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, Vite, CSS Modules
- **Testing**: Jest (Backend)
- **Deployment**: Docker, Render

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- Docker & Docker Compose (for local PostgreSQL)

### Installation

#### Option 1: Local Development with Docker (Recommended)

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd karaban
    ```

2.  **Start PostgreSQL with Docker**
    ```bash
    docker-compose up db -d
    ```

3.  **Backend Setup**
    ```bash
    # Install dependencies
    npm install

    # Initialize Database
    npx prisma migrate dev --name init
    npx prisma generate
    npm run seed # Optional: Seed with dummy data

    # Start Backend Server
    npm run dev
    ```
    The backend runs on `http://localhost:3001`.

4.  **Frontend Setup**
    ```bash
    cd frontend

    # Install dependencies
    npm install

    # Start Frontend Server
    npm run dev
    ```
    The frontend runs on `http://localhost:5173`.

#### Option 2: Full Docker Setup

```bash
# Start all services (backend, frontend, database)
docker-compose up

# Run migrations (in another terminal)
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

Access:
- Frontend: `http://localhost`
- Backend API: `http://localhost:3001`

## Deployment

### Deploy to Render (Recommended - 5 Minutes)

Render provides free hosting with PostgreSQL database included.

**Quick Deploy:**
1. Push code to GitHub
2. Create Render account at [render.com](https://render.com)
3. Click "New" → "Blueprint"
4. Connect your repository
5. Render will auto-deploy everything!

**Detailed Guide:** See [RENDER_SETUP.md](./RENDER_SETUP.md)

**Live URLs:**
- Frontend: `https://karaban-frontend.onrender.com`
- Backend: `https://karaban-backend.onrender.com`

### Deploy to AWS EC2 (Docker)
For production deployment on AWS EC2 using Docker, see the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide. This is the recommended approach for full control.

### Deploy to Render (Cloud Platform)
For quick cloud deployment without managing servers, see [RENDER_SETUP.md](./RENDER_SETUP.md).

## Project Structure

- `src/`: Backend source code (Controllers, Services, Repositories, Models)
- `frontend/`: Frontend React application
- `prisma/`: Database schema and migrations
- `tests/`: Backend unit tests
- `render.yaml`: Render deployment configuration
- `docker-compose.yml`: Local development setup

## API Documentation

- `GET /health`: Health check endpoint
- `GET /api/caravans`: List all caravans (supports filtering)
- `GET /api/caravans/:id`: Get caravan details
- `POST /api/reservations`: Create a reservation
- `POST /api/payments`: Process a payment
- `POST /api/reviews`: Submit a review

## Environment Variables

See `.env.example` for all required environment variables.

**Local Development:**
```bash
cp .env.example .env
# Edit .env with your local settings
```

**Production (Render):**
Environment variables are set automatically via `render.yaml`

## Testing

```bash
# Run backend tests
npm test

# Run with coverage
npm test -- --coverage
```

## License

MIT
