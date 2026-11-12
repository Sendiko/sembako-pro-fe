# Sembako Pro Frontend

This is a [Next.js](https://nextjs.org) frontend running on the [Bun](https://bun.sh) runtime.

## Getting Started

Install dependencies and run the development server:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Docker Compose

Create a deployment environment file and set the application port and public variables:

```bash
cp .env.example .env
```

Then build and start the production container:

```bash
docker compose up --build
```

Compose automatically loads `.env`. `APP_PORT` controls both the Next.js server port and the published host port.

The application is available at [http://localhost:3000](http://localhost:3000). Stop it with:

```bash
docker compose down
```
