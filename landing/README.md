# Isometric Holds — Landing Page Silo App

A standalone, high-performance landing page application for **Isometric Holds** (Android).

## Tech Stack
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Audio:** Web Audio API (Synthesized countdown beeps with zero external audio assets)

## Silo Architecture
This web app lives in its own subdirectory (`landing/`) completely isolated from the root React Native / Expo application. It has its own `package.json`, build pipeline, and dependency tree.

## Development

```bash
cd landing
bun install # or npm install
bun run dev # or npm run dev
```

The dev server will spin up at `http://localhost:5173`.

## Production Build

```bash
bun run build # or npm run build
```

The statically compiled production site will be output to `landing/dist/`.

## Preview Production Build

```bash
bun run preview # or npm run preview
```

## Static Assets & APK Sideloads
- `public/downloads/isometric-holds-v2.3.0-arm64.apk` (14.5 MB - optimized for modern Android)
- `public/downloads/isometric-holds-v2.3.0-universal.apk` (27.3 MB - universal architecture)
- `public/images/` (Contains exercise demonstration preview images)
