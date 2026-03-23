import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { GameState, GameCard, Player, ImagePair, UploadedImage } from '../types';

type GameAction =
  | { type: 'FLIP_CARD'; cardId: string }
  | { type: 'CHECK_MATCH' }
  | { type: 'MATCH_FOUND' }
  | { type: 'MATCH_FAILED' }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET'; cards: GameCard[]; players: Player[] };

const PAIR_COLORS = [
  '#b76e79', // rose
  '#7d9e7e', // sage
  '#6b8cae', // dusty blue
  '#c9a96e', // gold
  '#9b7bb8', // lavender
  '#d4856a', // terracotta
  '#5e9e9e', // teal
  '#c47d9e', // mauve
  '#8a9a5b', // olive
  '#d4a06a', // amber
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'FLIP_CARD': {
      if (state.isChecking || state.isGameOver) return state;

      const card = state.cards.find(c => c.id === action.cardId);
      if (!card || card.isFlipped || card.isMatched) return state;

      const cards = state.cards.map(c =>
        c.id === action.cardId ? { ...c, isFlipped: true } : c
      );

      if (!state.firstFlippedCard) {
        return { ...state, cards, firstFlippedCard: card };
      }

      // Second card flipped
      return {
        ...state,
        cards,
        secondFlippedCard: card,
        isChecking: true,
        moves: state.moves + 1,
      };
    }

    case 'CHECK_MATCH': {
      const { firstFlippedCard, secondFlippedCard } = state;
      if (!firstFlippedCard || !secondFlippedCard) return state;

      const isMatch =
        firstFlippedCard.pairId === secondFlippedCard.pairId &&
        firstFlippedCard.side !== secondFlippedCard.side;

      if (isMatch) {
        return { ...state, type: 'CHECK_MATCH' } as never; // handled by MATCH_FOUND
      }
      return state;
    }

    case 'MATCH_FOUND': {
      const { firstFlippedCard, secondFlippedCard } = state;
      if (!firstFlippedCard || !secondFlippedCard) return state;

      const matchedPairCount = new Set(
        state.cards.filter(c => c.isMatched).map(c => c.pairId)
      ).size;
      const matchColor = PAIR_COLORS[matchedPairCount % PAIR_COLORS.length];

      const cards = state.cards.map(c =>
        c.id === firstFlippedCard.id || c.id === secondFlippedCard.id
          ? { ...c, isMatched: true, isFlipped: true, matchColor }
          : c
      );

      const players = state.players.map((p, i) =>
        i === state.activePlayerIndex ? { ...p, score: p.score + 1 } : p
      );

      const isGameOver = cards.every(c => c.isMatched);

      return {
        ...state,
        cards,
        players,
        firstFlippedCard: null,
        secondFlippedCard: null,
        isChecking: false,
        isGameOver,
      };
    }

    case 'MATCH_FAILED': {
      const { firstFlippedCard, secondFlippedCard } = state;
      if (!firstFlippedCard || !secondFlippedCard) return state;

      const cards = state.cards.map(c =>
        c.id === firstFlippedCard.id || c.id === secondFlippedCard.id
          ? { ...c, isFlipped: false }
          : c
      );

      return {
        ...state,
        cards,
        firstFlippedCard: null,
        secondFlippedCard: null,
        isChecking: false,
      };
    }

    case 'NEXT_TURN': {
      const nextIndex = (state.activePlayerIndex + 1) % state.players.length;
      return { ...state, activePlayerIndex: nextIndex };
    }

    case 'RESET': {
      return createInitialState(action.cards, action.players);
    }

    default:
      return state;
  }
}

function createInitialState(cards: GameCard[], players: Player[]): GameState {
  return {
    cards,
    players,
    activePlayerIndex: 0,
    firstFlippedCard: null,
    secondFlippedCard: null,
    isChecking: false,
    isGameOver: false,
    moves: 0,
  };
}

export function createCardsFromPairs(pairs: ImagePair[], images: UploadedImage[]): GameCard[] {
  const imageMap = new Map(images.map(img => [img.id, img]));
  const cards: GameCard[] = [];
  for (const pair of pairs) {
    const imgA = imageMap.get(pair.imageAId);
    const imgB = imageMap.get(pair.imageBId);
    if (!imgA || !imgB) continue;
    cards.push({
      id: crypto.randomUUID(),
      pairId: pair.id,
      side: 'A',
      imageUrl: URL.createObjectURL(imgA.image),
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: crypto.randomUUID(),
      pairId: pair.id,
      side: 'B',
      imageUrl: URL.createObjectURL(imgB.image),
      isFlipped: false,
      isMatched: false,
    });
  }
  return shuffleArray(cards);
}

export function useGameLogic(initialCards: GameCard[], initialPlayers: Player[]) {
  const [state, dispatch] = useReducer(
    gameReducer,
    createInitialState(initialCards, initialPlayers)
  );

  const timeoutRef = useRef<number | null>(null);

  // Handle the check after two cards are flipped
  useEffect(() => {
    if (!state.isChecking || !state.firstFlippedCard || !state.secondFlippedCard) return;

    const { firstFlippedCard, secondFlippedCard } = state;
    const isMatch =
      firstFlippedCard.pairId === secondFlippedCard.pairId &&
      firstFlippedCard.side !== secondFlippedCard.side;

    timeoutRef.current = window.setTimeout(() => {
      if (isMatch) {
        dispatch({ type: 'MATCH_FOUND' });
      } else {
        dispatch({ type: 'MATCH_FAILED' });
        if (state.players.length > 1) {
          setTimeout(() => {
            dispatch({ type: 'NEXT_TURN' });
          }, 50);
        }
      }
    }, 1200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.isChecking, state.firstFlippedCard, state.secondFlippedCard]);

  const flipCard = useCallback((cardId: string) => {
    dispatch({ type: 'FLIP_CARD', cardId });
  }, []);

  const resetGame = useCallback((cards: GameCard[], players: Player[]) => {
    dispatch({ type: 'RESET', cards, players });
  }, []);

  return { state, flipCard, resetGame };
}
