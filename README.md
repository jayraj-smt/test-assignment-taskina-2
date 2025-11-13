# Number Discussion Application

A full-stack application where users communicate through numbers and mathematical operations, creating discussion trees similar to social media posts and comments.

## Tech Stack

- **Backend**: Node.js, TypeScript, Express, Sequelize
- **Frontend**: React, TypeScript
- **Database**: PostgreSQL
- **Containerization**: Docker Compose

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env
   cd server && cp .env.example .env
   ```

   Note: Update the `.env` file in the `server` directory with your database credentials if needed.

3. **Start PostgreSQL with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**

   ```bash
   cd server && npm run migrate
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: http://localhost:8000
- Backend API: http://localhost:5000

## Project Structure

```
├── server/          # Backend application
├── client/          # Frontend React application
├── docker-compose.yml
└── .env.example
```
