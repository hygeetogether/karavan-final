# CaravanShare - Backend Design Document

This document outlines the design principles and architectural patterns used in the CaravanShare backend. The design was guided by the initial requirements to refactor a monolithic, tightly-coupled class into a clean, scalable, and testable application.

## 1. Core Principles

The architecture is built on a foundation of widely accepted software design principles to ensure maintainability and quality.

-   **Separation of Concerns (SoC):** The application is divided into distinct layers (`controllers`, `services`, `repositories`, `models`), each with a specific responsibility. This reduces complexity and makes the system easier to understand and modify.

-   **Single Responsibility Principle (SRP):** Each class and module has one primary reason to change. For example, `UserRepository` is only responsible for user data access, while `ReservationService` handles the business logic for creating and managing reservations.

-   **Dependency Inversion Principle (DIP):** High-level modules (like services) do not depend on low-level modules (like repositories); both depend on abstractions. This is achieved through Dependency Injection, where services receive repository instances via their constructors.

## 2. Architectural Patterns

### Layered Architecture

The code is organized into the following layers:

1.  **Routes/Controllers (Presentation Layer):** Responsible for handling HTTP requests, validating input, and returning responses. Controllers are kept "thin" by delegating all business logic to the service layer.
2.  **Services (Business Logic Layer):** This is the core of the application. Services orchestrate business processes, enforce rules, and coordinate data access by using one or more repositories. For example, `PaymentService` uses multiple repositories and calls `ReservationService` to fulfill a payment request.
3.  **Repositories (Data Access Layer):** This layer provides an abstraction over the data source. It exposes methods for querying and manipulating data (e.g., `findById`, `create`). By using the Repository Pattern, the rest of the application is decoupled from the specific data storage technology (currently in-memory, but can be swapped for a SQL/NoSQL database).

### Dependency Injection (DI)

To manage dependencies and facilitate testing, the application uses a simple DI container (`src/container.ts`).

-   **Singleton Instances:** The container creates single, shared instances of all repositories and services.
-   **Loose Coupling:** Route handlers and services receive their dependencies from the container, rather than creating them. This makes it easy to replace a real dependency with a mock object in tests. For example, `CaravanRoutes` gets a fully-formed `CaravanController` which in turn has been created with the necessary repositories.

## 3. Data Structures and Performance

-   **Repository Indexing:** The in-memory repositories use `Map` data structures for efficient, O(1) lookups by ID (e.g., `reservationsById`). This is significantly more performant than iterating through lists (O(n)), which was a key problem in the initial "bad design" example.
-   **Targeted Lookups:** For more complex queries, such as finding reservations for a specific caravan, a secondary index (`reservationsByCaravanId`) is used to avoid full scans.

## 4. Error Handling

A robust and consistent error handling strategy is implemented:

-   **Custom Error Classes:** A hierarchy of custom error classes (`ApiError`, `BadRequestError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`) is defined in `src/errors`. This allows services to throw specific, meaningful errors.
-   **Centralized Error Middleware:** A single `errorHandler` middleware is registered at the end of the Express app's middleware chain. It catches all errors thrown from the controllers (via `next(error)`), identifies the error type, and sends a standardized JSON error response with the correct HTTP status code.

## 5. Testability

The architecture was designed with testability as a primary goal.

-   **Mocking:** Because dependencies are injected, it is straightforward to mock any part of the system. For example, when testing `UserController`, the `UserRepository` is mocked using `jest.mock()`, allowing the controller's logic to be tested in complete isolation.
-   **Pure Business Logic:** Services like `ReservationValidator` contain pure, stateless logic, making them extremely easy to unit test with various inputs.
