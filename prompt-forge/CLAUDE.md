# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prompt Forge is a single-page web app for designing and refining AI prompt systems. It features a 3D tesseract visualization (Three.js) and a prompt builder with three modes (Specification, Lite, Strict). Originally exported from Google AI Studio.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (Vite, port 3000, host 0.0.0.0)
npm run build     # Production build
npm run preview   # Preview production build
```

## Architecture

**Single-file app**: Nearly all code lives in `index.html` — HTML structure, embedded CSS (`<style>`), and embedded JavaScript (`<script>`). There is no framework (no React/Vue despite the `.tsx` entry point existing — `index.tsx` is empty).

**Key sections in index.html:**
- **CSS** (lines 17-492): CSS custom properties for theming (`--gold-primary`, `--neon-green`, `--bg-base`), responsive design with `@media (min-width: 768px)`, scroll-reveal animations via IntersectionObserver
- **Three.js tesseract** (lines 657-817): `init3D()` — creates a rotating wireframe tesseract (inner + outer cube with connectors), gold-to-green color pulsing, mouse parallax, `prefers-reduced-motion` support
- **UI logic** (lines 819-832): `initUI()` — IntersectionObserver for section fade-in
- **Prompt builder** (lines 835-919): `forgePrompt(inputText, mode)` — pure function generating structured prompts in three modes (`spec`, `lite`, `strict`), copy-to-clipboard functionality

**Configuration:**
- `vite.config.ts`: Exposes `GEMINI_API_KEY` from `.env.local` as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (currently unused in code)
- `@` path alias resolves to project root
- TypeScript configured with `react-jsx` transform but no React dependency installed

## Environment

Set `GEMINI_API_KEY` in `.env.local` (gitignored via `*.local` pattern). Currently used only as a build-time define — no API calls are made in the app yet.
