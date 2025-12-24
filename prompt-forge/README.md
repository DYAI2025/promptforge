<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Prompt Forge

Prompt Forge is a single-page experience for designing and refining AI prompt systems. The landing page layers a WebGL wireframe animation behind content that explains the value proposition and invites visitors to experiment with structured prompt generation. The "Prompt Forge" console lets users pick a task, model, tone, and safety profile, then generates a structured prompt they can copy for downstream use.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Run the app in dev mode: `npm run dev`
3. (Optional) Set `GEMINI_API_KEY` in `.env.local` if you need the value exposed to front-end code via Vite's `process.env` shim.

## Build for Production / GitHub Pages

The project uses Vite and is configured to publish static assets to `dist/` with a custom domain via GitHub Pages.

1. Build the site: `npm run build`
2. Deploy the contents of `dist/` to the `gh-pages` branch (or your chosen Pages source).
3. Keep `public/CNAME` in the repository so GitHub Pages serves the site at **prompt.machinetool.site**.
4. `public/ads.txt` is included for AdSense and will be copied to the root of the published site.

## Google AdSense Placement

- The global AdSense loader and account meta tag are injected in the `<head>` of `index.html`.
- `public/ads.txt` contains the required seller record: `google.com, pub-1712273263687132, DIRECT, f08c47fec0942fa0`.
