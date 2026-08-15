# anaqin5 — Art Portfolio

A modern, single-screen React + Vite art portfolio for
**[@anaqin5](https://x.com/anaqin5)**, deployed on GitHub Pages. The whole page
fits in one viewport — no scrolling. Click any artwork to view it up close.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Replace the placeholder artwork

The site displays 6 artworks in a 3×2 grid, hotlinked directly from X
(Twitter) so no image files live in the repo.

To swap the artwork:

1. Open `src/data/works.js` and update each entry:
   - `src` — the direct image URL
   - `title`, `medium`, `year` — your piece's details
   - `alt` — a short description for accessibility
2. Update the contact email in `src/components/Footer.jsx` if needed.

## Deploy to GitHub Pages

1. Push this repository to GitHub (the workflow in
   `.github/workflows/pages.yml` builds and deploys automatically).
2. In the repo settings, open **Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` redeploys the site.

The site uses relative asset paths (`base: './'`), so it works under both
`https://<username>.github.io/` and `https://<username>.github.io/portfolio/`.
