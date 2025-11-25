# CaravanShare Walkthrough

## Overview
CaravanShare is a fully functional MVP for a peer-to-peer caravan sharing platform. This document outlines the implemented features and how to verify them.

## Implemented Features

### 1. User Management
- **Guest & Host Roles**: Users can sign up and identify as either a Guest or a Host.
- **Mock Login**: Simple login flow for demonstration purposes.

### 2. Caravan Discovery
- **Listing Page**: Browse all available caravans.
- **Search & Filter**: Filter caravans by **Location** and **Price Range**.
- **Map View**: Toggle between list view and an interactive map (Leaflet) to see caravan locations.

### 3. Reservation Flow
- **Detail Page**: View caravan photos, amenities, and host information.
- **Booking**: Select dates to calculate total price and proceed to reservation.
- **Validation**: Prevents booking for invalid dates or by non-logged-in users.

### 4. Payments
- **Mock Payment**: Secure-looking payment form to confirm reservations.
- **Confirmation**: Updates reservation status to `CONFIRMED` upon successful payment.

### 5. Reviews
- **Review System**: Guests can leave star ratings and comments for caravans.
- **Display**: Average rating and review count are displayed on listing and detail pages.

## Technical Highlights

- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Frontend**: React, TypeScript, Vite, CSS Modules, Leaflet.
- **Database**: PostgreSQL (configured in Docker/Prisma).
- **Deployment**: Dockerized (Frontend + Backend + DB) with Nginx reverse proxy.
- **CI/CD**: GitHub Actions workflow for automated testing.

## Verification Steps

1.  **Run the Stack**:
    ```bash
    ./deploy.sh
    ```
2.  **Access the App**: Open `http://localhost` (or your server IP).
3.  **Test the Flow**:
    - Search for "Lake" in the location bar.
    - Switch to Map view to see markers.
    - Click a caravan, select dates, and reserve.
    - Complete the mock payment.
    - Verify the trip appears in "My Trips".
