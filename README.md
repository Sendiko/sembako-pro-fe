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

Copy the required public variables to `.env.local`, then build and start the production container:

```bash
bun install
docker compose --env-file .env.local up --build
```

The `--env-file` flag supplies the `NEXT_PUBLIC_*` values during the image build. Compose also loads `.env.local` into the running container when the file is present.

The application is available at [http://localhost:3000](http://localhost:3000). Stop it with:

```bash
docker compose --env-file .env.local down
```
