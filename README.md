# Uma Saris

Responsive sari catalog and sales tracker built with React + Vite.

## Features

- Catalog with 2-column sari cards and neutral diamond tile placeholder
- Status badges: Available, Reserved, Sold Out
- Add sari modal (supports optional image upload)
- Sales log modal with buyer, quantity, sale price, payment method, and date
- Inventory auto-decrements when a sale is recorded
- localStorage persistence for catalog and sales data
- Mobile + desktop responsive layout

## Local Development

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev

## Production Build

npm run build

## Deploy to Vercel (Single Command)

npm run deploy

If Vercel CLI is not installed yet:

npx vercel --prod
