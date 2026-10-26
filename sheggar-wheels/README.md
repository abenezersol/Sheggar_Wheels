# Sheggar Wheels

Next.js + TypeScript car-rental demo for Addis Ababa.

## Run locally

1. Open this folder in your terminal.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Visit `http://localhost:3000`.

The public homepage is in `src/app/(public)/page.tsx`. The default Next.js starter homepage has been removed so it no longer overrides the intended public route. Google-hosted font imports were also removed to avoid build failures when the font service is unreachable.

## Demo limitations

The included seed data and browser localStorage are for demonstration only, not production authentication or a production database.
