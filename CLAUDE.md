# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Greek mythology encyclopedia built with React + TypeScript + Vite. Features character profiles, interactive family trees (rendered with D3.js), and a dark/gold visual theme inspired by ancient Greece. All content is in Spanish.

## Commands

- `npm run dev` — Start dev server with HMR
- `npm run build` — Production build (output in `dist/`)
- `npm run preview` — Preview production build
- `npm run lint` — ESLint (flat config, React hooks + refresh rules)

## Architecture

**Routing** (`App.tsx`): React Router v7 with BrowserRouter.
- `/` — Home page
- `/arboles` and `/arboles/:treeId` — Family tree viewer
- `/personajes` — Character gallery
- `/personaje/:characterId` — Character detail

**Data layer** (`src/data/`): All mythology data is static — no backend or API.
- `characters/*.json` — One JSON file per character (98 files). Auto-loaded by Vite glob import in `characters/index.ts`. Each file has: `id`, `name`, `greekName`, `category`, `gender`, `title`, `description`, `versions`, `parents`, `partners`, `children`, `trees`.
- `characters/index.ts` — Glob loader + query helpers (`getCharacter`, `getAllCharacters`, `getCharactersByCategory`, `searchCharacters`, etc.) + `categories` array.
- `trees/` — Each tree (titanes, olimpicos, heroes, sisifo) is a separate file exporting a `TreeData` with a recursive `TreeNode` structure. Tree graph JSON files live in `src/assets/tree_json/`.
- `src/types/index.ts` — All shared types (`Character`, `TreeNode`, `TreeData`, `TreeId`, `CharacterCategory`)

**Tree visualization** (`src/components/tree/TreeView.tsx`): D3.js hierarchical tree rendered into an SVG. Supports partner nodes, group nodes (e.g. Musas), expand/collapse, zoom/pan, and click-to-navigate to character detail.

**Styling**: Plain CSS with BEM naming. CSS variables defined in `src/styles/variables.css` (colors, typography, spacing). Category colors map to `--color-primordial`, `--color-titan`, `--color-olimpico`, etc. Fonts: Cinzel (display), Inter (body), Noto Serif (Greek text).

**Images**: Character portraits stored in `public/images/personajes/` as PNG files named after the character (e.g. `Zeus.png`). Image path resolution is handled by `src/utils/images.ts`.

## Key Conventions

- Character IDs are lowercase Spanish strings (e.g. `zeus`, `cronos`, `caos`) used consistently across data files, routes, and image filenames
- Tree nodes reference characters by their ID; the `getCharacter()` helper resolves the full character data
- New characters: create `src/data/characters/{id}.json` (auto-discovered by glob import) and add nodes/edges to the appropriate tree JSON in `src/assets/tree_json/`
- New trees require a new `TreeId` union member in `src/types/index.ts`, a data file in `src/data/trees/`, and registration in `src/data/trees/index.ts`
