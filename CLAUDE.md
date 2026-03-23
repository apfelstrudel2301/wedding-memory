# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check with `tsc -b` then build with Vite
- `npm run lint` — ESLint across the project
- `npm run preview` — preview production build

## Architecture

Wedding-themed memory card game built with React 19, TypeScript, Vite 8, and react-router-dom v7. No backend — all data is stored client-side in IndexedDB via the `idb` library.

### Routing (src/App.tsx)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | HomePage | Landing page |
| `/admin` | AdminSetupPage | Upload images, create pairs, configure players |
| `/game` | GameBoardPage | The memory game itself |
| `/results` | ResultsPage | Post-game scoreboard |

All pages except `/game` are wrapped in `PageWrapper` (shared layout chrome).

### Data Flow

1. **Admin setup** (`useImagePairs` hook): Images are uploaded, compressed (`utils/compressImage.ts`), and stored as blobs in IndexedDB. Users create pairs by linking two images.
2. **Game start**: Player names and game title are passed via `sessionStorage`. Image pairs are loaded from IndexedDB and converted to `GameCard[]` with `createCardsFromPairs()`.
3. **Game state** (`useGameLogic` hook): `useReducer`-based state machine handling card flips, match checking (with timers), turn rotation, and scoring. Actions: `FLIP_CARD`, `CHECK_MATCH`, `MATCH_FOUND`, `MATCH_FAILED`, `NEXT_TURN`, `RESET`.
4. **Results**: Final player scores are passed via `sessionStorage` to the results page.

### Storage Layer (src/storage/db.ts)

IndexedDB database `wedding-memory-game` with two object stores:
- `images` — individual uploaded images (blobs)
- `image-pairs` — pair metadata linking two image IDs

### Key Types (src/types/index.ts)

`UploadedImage`, `ImagePair`, `GameCard`, `Player`, `GameState`

### Styling

CSS Modules (`*.module.css`) per component. Global styles in `src/index.css`.

### UI Language

All user-facing text must be in German.
