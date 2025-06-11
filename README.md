# Gift List Manager

A gift list management application built with Nuxt.js 3, Tailwind CSS, and PostgreSQL.

## Features

- Create and manage groups of people (family, friends, colleagues)
- Create events for each group (birthdays, Christmas, weddings)
- Add gifts to events
- Reserve gifts for others
- Share public links to gift lists

## Prerequisites

- Node.js (v16 or later)
- Docker and Docker Compose
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd gift-list-manager
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the PostgreSQL database using Docker:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the necessary database schema.

4. Create a `.env` file (or use the existing one) with the following content:

```
# Database configuration
POSTGRES_USER=giftuser
POSTGRES_PASSWORD=giftpassword
POSTGRES_DB=giftlistdb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Application configuration
NODE_ENV=development
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
# or
yarn dev
# or
bun run dev
# or
bun run start  # Recommended for Bun users
```

### Using Bun

This project is configured to work optimally with Bun. If you're using Bun as your JavaScript runtime and package manager, you can use the following commands:

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
# or
bun run start
```

The `bun run start` command uses a custom script that provides better error handling and process management when running the Nuxt development server with Bun.

#### Bun Configuration

This project includes the following Bun-specific configuration files:

- `bunfig.toml`: Contains Bun configuration settings for installation, running, development, testing, and debugging.
- `package.json`: Includes a "bun" section with trusted dependencies.
- `start.js`: A custom script for running the Nuxt development server with Bun.

These configurations ensure that Bun works optimally with this Nuxt.js project.

### Using WebStorm Services

If you're using WebStorm, you can run the development server directly from the Services tab:

1. Open your project in WebStorm
2. Go to the Services tab (usually at the bottom of the window)
3. Find "Nuxt Dev Server" under the Bun section
4. Click the play button to start the server

This configuration is already set up in the project's `.idea/workspace.xml` file.

## Database Management

The application uses PostgreSQL for data storage. The database schema is automatically created when the Docker container starts, using the initialization script in `server/db/init.sql`.

### Adminer

The project includes Adminer, a lightweight database management tool, which is accessible at `http://localhost:8080` when the Docker containers are running. Use the following credentials to log in:

- System: PostgreSQL
- Server: postgres
- Username: giftuser
- Password: giftpassword
- Database: giftlistdb

### Reset Database

To reset the database, you can stop and remove the Docker container, then start it again:

```bash
docker-compose down -v
docker-compose up -d
```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/gifts` - Get all gifts or filter by eventId
- `POST /api/gifts` - Create a new gift
- `GET /api/gifts/:id` - Get a gift by ID
- `PUT /api/gifts/:id` - Update a gift
- `DELETE /api/gifts/:id` - Delete a gift
- `POST /api/gifts/:id/reserve` - Reserve a gift
- `DELETE /api/gifts/:id/reserve` - Cancel a gift reservation

## Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Locally preview production build:

```bash
npm run preview
# or
yarn preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information on deploying to production.
