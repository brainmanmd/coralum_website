This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load the app’s font assets for the containerized deployment.

## OAuth provider setup

To enable the real connection flow for a provider, create an OAuth application in that provider's developer console first.

### Oura

1. Sign in to the Oura developer portal and create a new OAuth app.
2. Set the redirect URI to `http://localhost:3000/api/oura/callback` for local development.
3. Copy the client ID and client secret into your environment variables.
4. Create a local `.env.local` file (or populate your shell environment) with:

```bash
OURA_CLIENT_ID=your_client_id
OURA_CLIENT_SECRET=your_client_secret
OURA_REDIRECT_URI=http://localhost:3000/api/oura/callback
```

### Whoop

```bash
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REDIRECT_URI=http://localhost:3000/api/whoop/callback
```

### Fitbit

```bash
FITBIT_CLIENT_ID=your_client_id
FITBIT_CLIENT_SECRET=your_client_secret
FITBIT_REDIRECT_URI=http://localhost:3000/api/fitbit/callback
```

A sample file is available at `.env.example`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to Google Cloud Run

This repository is prepared for a containerized deployment on Google Cloud Run via Cloud Build.

Recommended flow:

1. Build the container image from the included [Dockerfile](Dockerfile).
2. Push the image to Artifact Registry or Google Container Registry.
3. Deploy the image to Cloud Run with the service name, region, and environment variables configured in your GCP project.

A Cloud Build configuration is included at [cloudbuild.yaml](cloudbuild.yaml) so pushes to the configured branches can build and deploy the app automatically.

For local development, provide a PostgreSQL connection string through `POSTGRES_URL` and run the app as usual.
