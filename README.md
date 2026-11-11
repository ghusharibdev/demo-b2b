# Lahore Boutique

A fast, static catalogue site for **Lahore Boutique**, Allama Iqbal Town, Lahore, Pakistan. Built with Astro, Tailwind CSS, and TypeScript for deployment on Cloudflare Pages.

## Requirements

- **Node.js 22 LTS** (`>=22.23.4`) — Node 20 and older are end-of-life and are not supported.
- **npm 10** or newer.

The required version is pinned in `.nvmrc` and `.node-version`:

```bash
nvm install     # reads .nvmrc -> Node 22
nvm use         # reads .nvmrc -> Node 22
```

## Stack

| Package | Version |
| --- | --- |
| `astro` | `^7.4.11` |
| `tailwindcss` + `@tailwindcss/vite` | `^4.3.5` |
| `@fontsource-variable/inter` + `@fontsource-variable/playfair-display` | `^5.3.0` |
| `typescript` | `^6.0.3` |
| `@astrojs/check` | `^0.9.12` |

`astro check` does not support TypeScript 7 yet (Astro prints an explicit
error and asks for TypeScript 6), so TypeScript stays on the 6.x line until
Astro adds TS 7 support.

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
4. Set the build image to **Node 22**. In the Cloudflare dashboard this is the
   `NODE_VERSION` environment variable — set it to `22` for both production and
   preview builds. Astro 7 requires Node `>=22.23.4`, so a Node 20 build image
   will fail.
5. Save and deploy. No adapter, server functions, database, or environment variables are required.

There is no `wrangler.toml` in this project: the site is fully static (Astro
`output: 'static'`) and is deployed through the Cloudflare Pages Git
integration, so no Worker runtime or `nodejs_compat` flag is needed. If you
later add a Wrangler-based deployment, pin it to Node 22 and set
`compatibility_flags = ["nodejs_compat"]`.

## Editing products

All catalogue content lives in `src/data/products.ts`. Business details are in `src/data/site.ts`.

## Photos

Replace the seven placeholder files in `public/images/` with real photos while keeping the same filenames. See `public/images/README.md` for the recommended specs. If a photo is missing, the design falls back to a clean product-name placeholder instead of showing a broken image.

## Motion

Hero load animation, scroll reveals, card filtering, image hover zoom, WhatsApp button feedback, sticky header state, and the floating button pulse are all CSS-driven. A small IntersectionObserver script adds reveal classes, and all motion is disabled for visitors using `prefers-reduced-motion: reduce`. The site remains fully readable with JavaScript disabled.
