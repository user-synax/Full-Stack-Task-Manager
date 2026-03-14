# Production-Ready Task Management Application

A secure, scalable, and feature-rich Task Management Application built with Next.js 14, MongoDB, and TailwindCSS.

## Features

- **Authentication**: JWT-based authentication stored in HTTP-only cookies.
- **Security**: 
  - Password hashing with `bcryptjs`.
  - AES-256-CBC encryption for sensitive task descriptions.
  - Input validation with `Zod`.
  - Protected API routes and middleware.
- **Task Management**:
  - CRUD operations (Create, Read, Update, Delete).
  - Search by title.
  - Filter by status (pending, in-progress, completed).
  - Pagination support.
- **Frontend**: Responsive UI built with TailwindCSS and Next.js App Router.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, React.
- **Backend**: Next.js API Routes (Node.js runtime).
- **Database**: MongoDB with Mongoose ODM.
- **Validation**: Zod.
- **Encryption**: Node.js `crypto` (AES-256-CBC).

## Project Structure

```
task-manager/
├── app/                  # Next.js App Router pages and API routes
├── components/           # Reusable UI components
├── lib/                  # Core utilities (DB, JWT, Crypto)
├── models/               # Mongoose schemas
├── middleware/           # Auth helpers
├── utils/                # Validation and Error handling
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository.
2. Navigate to the project folder:
   ```bash
   cd task-manager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in your `MONGODB_URI`, `JWT_SECRET`, and `ENCRYPTION_KEY`.
   ```bash
   cp .env.example .env
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive an HTTP-only cookie.

### Tasks
- `GET /api/tasks`: List user tasks (supports `page`, `limit`, `search`, `status`).
- `POST /api/tasks`: Create a new task.
- `GET /api/tasks/:id`: Get a specific task.
- `PUT /api/tasks/:id`: Update a task.
- `DELETE /api/tasks/:id`: Delete a task.

## Security Implementation

- **HTTP-Only Cookies**: JWT is stored in a cookie that cannot be accessed via client-side JavaScript, preventing XSS attacks.
- **AES-256 Encryption**: Task descriptions are encrypted before being stored in MongoDB and decrypted only when requested by the owner.
- **Zod Validation**: Strict schema validation for all incoming requests to prevent malformed data or injection attempts.
- **Ownership Check**: Every task operation verifies that the task belongs to the authenticated user.

## Deployment

This application is ready to be deployed on **Vercel**.
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add the environment variables from your `.env` file to Vercel's project settings.
4. Deploy!
