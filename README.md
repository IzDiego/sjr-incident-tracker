Vercel link: https://sjr-incident-tracker.vercel.app/
Trello Link: https://trello.com/invite/b/67e20a958e9ed6a969578027/ATTIb9b4446c63b3d6e9ea58ceb2f4fc82fc6BE9A1DF/kanban-sjr

# Incident Tracking System

A full-stack application for tracking and managing technical incidents in an organization. Built with Next.js, Prisma, and PostgreSQL.

## Features

- Create and manage technical incidents
- Track incident status and priority
- Responsive design with Tailwind CSS
- Real-time updates
- User assignment system
- Secure API endpoints

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sjr-incident-tracker
   ```

2. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   The `.env` file is already configured for the Docker database setup. If you need to modify it:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/incident_db?schema=public"
   ```

5. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Management

### Using Docker

- Start the database: `docker-compose up -d`
- Stop the database: `docker-compose down`
- View logs: `docker-compose logs postgres`
- Access PostgreSQL CLI: `docker exec -it incident-tracker-db psql -U postgres -d incident_db`

### Using Prisma

- Create a migration: `npx prisma migrate dev`
- Reset database: `npx prisma migrate reset`
- View data in Prisma Studio: `npx prisma studio`

## Database Schema

The application uses the following main models:

- **Incident**: Stores incident information including title, description, priority, and status
- **User**: Manages user information and assignments

## API Routes

- `POST /api/incidents`: Create a new incident
- `GET /api/incidents`: List all incidents
- `PATCH /api/incidents/[id]`: Update incident status
- `GET /api/incidents/[id]`: Get incident details

## Development

- Run tests: `npm test`
- Check types: `npm run typecheck`
- Lint code: `npm run lint`

## Deployment

The application is automatically deployed to Vercel through GitHub Actions when changes are pushed to the main branch.

Required environment variables for deployment:
- `DATABASE_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
