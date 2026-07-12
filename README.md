# ODDO Hackathon Project

A TypeScript monorepo for a fleet and transit operations platform. It includes a React-based web dashboard and a backend API for managing vehicles, drivers, trips, maintenance, fuel expenses, and reports.

## Project Structure

- apps/web: Frontend application built with React and Vite
- apps/api: Backend API and business logic
- packages/shared: Shared TypeScript types and helpers

## Features

- Dashboard overview for operations teams
- Driver and vehicle management
- Trip tracking and reporting
- Maintenance and fuel expense management
- Shared data models across frontend and backend

## Tech Stack

- TypeScript
- React + Vite
- Node.js backend
- Prisma for database access
- Monorepo organization with shared packages

## Getting Started

1. Install dependencies for the apps:
   - cd apps/web && npm install
   - cd ../api && npm install
   - cd ../../packages/shared && npm install
2. Start the development servers:
   - cd apps/web && npm run dev
   - cd apps/api && npm run dev
3. If database setup is required, run Prisma migrations from the API app:
   - cd apps/api && npx prisma migrate dev

## Development Notes

- Keep shared contracts in the shared package for consistency.
- Use the API for business logic and persistence.
- Update this README when adding major features or modules.
