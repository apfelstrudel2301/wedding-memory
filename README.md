# Wedding Memory Game

A wedding-themed memory card game built with React. Upload custom image pairs, then play a multiplayer matching game on a shared device — perfect for wedding receptions.

## How It Works

1. **Set up** — The game organizer uploads pairs of related images (e.g., bride's childhood photo paired with groom's childhood photo)
2. **Add players** — Enter player names and a game title
3. **Play** — Players take turns flipping two cards. If the cards are a matching pair, the player scores a point and goes again. If not, the next player takes a turn.
4. **Winner** — The player with the most matched pairs wins

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Pages

| Route | Description |
|---|---|
| `/` | Welcome screen |
| `/admin` | Upload images, create pairs, configure players |
| `/game` | The memory game board |

Uses `HashRouter` — routes are hash-based (e.g., `/#/admin`).

## Tech Stack

- **React 19** + TypeScript
- **Vite** for dev/build tooling
- **React Router** (v7, HashRouter) for client-side navigation
- **IndexedDB** (via `idb`) for storing uploaded images as compressed blobs
- **CSS Modules** with a custom wedding color palette

## Project Structure

```
src/
├── components/
│   ├── admin/       # ImageUploader, ImagePool, PairPreviewCard, PairList
│   ├── game/        # Card, CardGrid, ScoreBoard, Fireworks
│   ├── layout/      # PageWrapper, WeddingHeader
│   └── ui/          # Button, Input, Modal
├── hooks/
│   ├── useGameLogic.ts    # Game state reducer (flip, match, turns)
│   └── useImagePairs.ts   # IndexedDB pair management
├── pages/           # One page component per route
├── storage/db.ts    # IndexedDB setup and CRUD operations
├── types/index.ts   # TypeScript interfaces
└── utils/           # Image compression utility
```

## Key Details

- **All data stays in the browser** — no backend needed. Images are stored in IndexedDB and persist across sessions.
- **Images are compressed** on upload (resized to 800px max width, JPEG quality 0.7) to keep storage manageable.
- **Card matching** requires finding the two different images that were uploaded as a pair — not two identical images.
- **Turn logic** — a successful match lets the player go again; a miss passes the turn.

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server.
