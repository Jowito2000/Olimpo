# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Greek mythology encyclopedia built with Next.js (App Router) + TypeScript + Tailwind CSS v4. Features character profiles, interactive family trees (rendered with D3.js), and a dark/gold visual theme inspired by ancient Greece. All content is in Spanish.

## Commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build (output in `.next/`)
- `npm start` — Serve production build
- `npm run lint` — Next.js lint

## Architecture

**Routing** (`src/app/`): Next.js App Router with file-based routing.
- `/` — Home page (`src/app/page.tsx`)
- `/arboles` and `/arboles/[treeId]` — Family tree viewer
- `/personajes` — Character gallery
- `/personaje/[characterId]` — Character detail
- `/glosario` — Glossary page
- `/linea-temporal` — Timeline page

**Layout** (`src/app/layout.tsx`): Root layout with Navbar, Footer, and global styles. Metadata (title, description, OG tags) defined here.

**Page components** (`src/components/pages/`): Client components (`'use client'`) for pages with interactivity (search, filters, D3, framer-motion). Route pages in `src/app/` are thin wrappers passing params.

**Data layer** (`src/data/`): All mythology data is static — no backend or API.
- `characters/*.json` — One JSON file per character (98 files). Loaded via explicit barrel imports in `characters/index.ts`. Each file has: `id`, `name`, `greekName`, `category`, `gender`, `title`, `description`, `versions`, `parents`, `partners`, `children`, `trees`.
- `characters/index.ts` — Barrel imports + query helpers (`getCharacter`, `getAllCharacters`) + `categories` array.
- `trees/` — Each tree (titanes, olimpicos, heroes, sisifo) is a separate file exporting a `TreeData` with a recursive `TreeNode` structure. Tree graph JSON files live in `src/assets/tree_json/`.
- `src/types/index.ts` — All shared types (`Character`, `TreeNode`, `TreeData`, `TreeId`, `CharacterCategory`)

**Tree visualization** (`src/components/tree/TreeView.tsx`): D3.js hierarchical tree rendered into an SVG. Supports partner nodes, group nodes (e.g. Musas), expand/collapse, zoom/pan, and click-to-navigate to character detail. Uses `'use client'` with `useRouter` from `next/navigation`.

**Styling**: Tailwind CSS v4 with `@theme` block in `src/app/globals.css`. CSS custom properties also in `:root` for legacy CSS files (TreeView, Hero animations). Some complex CSS (D3 tree, Hero keyframes, timeline layout, glossary card animations) remains in co-located `.css` files where Tailwind isn't practical. Category colors map to `--color-primordial`, `--color-titan`, `--color-olimpico`, etc. Fonts: Cinzel (display), Inter (body), Noto Serif (Greek text).

**Images**: Character portraits stored in `public/images/personajes/` as PNG files named after the character (e.g. `Zeus.png`). Image path resolution is handled by `src/utils/images.ts`.

## Key Conventions

- Character IDs are lowercase Spanish strings (e.g. `zeus`, `cronos`, `caos`) used consistently across data files, routes, and image filenames
- Tree nodes reference characters by their ID; the `getCharacter()` helper resolves the full character data
- New characters: create `src/data/characters/{id}.json`, add the import to `src/data/characters/index.ts` barrel, and add nodes/edges to the appropriate tree JSON in `src/assets/tree_json/`
- New trees require a new `TreeId` union member in `src/types/index.ts`, a data file in `src/data/trees/`, and registration in `src/data/trees/index.ts`
- Path aliases: `@/*` maps to `./src/*` (configured in tsconfig.json)
- Client components use `'use client'` directive; route pages in `src/app/` are server components that pass params to client page components
