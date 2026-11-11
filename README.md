# Lahore Boutique

A fast, static catalogue site for **Lahore Boutique**, Allama Iqbal Town, Lahore, Pakistan. Built with Astro, Tailwind CSS, and TypeScript for deployment on Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

Open the local URL shown by Astro.

## Production build

```bash
npm run build
```

The static site is generated in `dist/`.

## Deploy to Cloudflare Pages

1. Push this project to a GitHub repository.
2. In Cloudflare Pages, choose **Connect to Git** and select the repository.
3. Use these build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save and deploy. No adapter, server functions, database, or environment variables are required.

## Editing products

All catalogue content lives in `src/data/products.ts`. Business details are in `src/data/site.ts`.

## Photos

Replace the seven placeholder files in `public/images/` with real photos while keeping the same filenames. See `public/images/README.md` for the recommended specs. If a photo is missing, the design falls back to a clean product-name placeholder instead of showing a broken image.

## Motion

Hero load animation, scroll reveals, card filtering, image hover zoom, WhatsApp button feedback, sticky header state, and the floating button pulse are all CSS-driven. A small IntersectionObserver script adds reveal classes, and all motion is disabled for visitors using `prefers-reduced-motion: reduce`. The site remains fully readable with JavaScript disabled.
