import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { CardGrid } from '../components/game/CardGrid';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { TurnIndicator } from '../components/game/TurnIndicator';
import { useGameLogic, createCardsFromPairs } from '../hooks/useGameLogic';
import { getAllPairs, getAllImages } from '../storage/db';
import type { Player, GameCard } from '../types';
import styles from './GameBoardPage.module.css';

export function GameBoardPage() {
  const navigate = useNavigate();
  const [initialCards, setInitialCards] = useState<GameCard[] | null>(null);
  const [initialPlayers, setInitialPlayers] = useState<Player[] | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const playerNames = JSON.parse(sessionStorage.getItem('players') || '[]') as string[];
    if (playerNames.length < 2) {
      navigate('/players');
      return;
    }

    const players: Player[] = playerNames.map((name) => ({
      id: crypto.randomUUID(),
      name,
      score: 0,
    }));

    Promise.all([getAllPairs(), getAllImages()]).then(([pairs, images]) => {
      if (pairs.length < 2) {
        navigate('/admin');
        return;
      }
      const cards = createCardsFromPairs(pairs, images);
      objectUrlsRef.current = cards.map(c => c.imageUrl);
      setInitialCards(cards);
      setInitialPlayers(players);
    });

    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, [navigate]);

  if (!initialCards || !initialPlayers) {
    return (
      <div className={styles.loading}>
        <p>Loading game...</p>
      </div>
    );
  }

  return <GameBoard initialCards={initialCards} initialPlayers={initialPlayers} />;
}

function GameBoard({
  initialCards,
  initialPlayers,
}: {
  initialCards: GameCard[];
  initialPlayers: Player[];
}) {
  const navigate = useNavigate();
  const { state, flipCard } = useGameLogic(initialCards, initialPlayers);

  useEffect(() => {
    if (state.isGameOver) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('results', JSON.stringify(state.players));
        navigate('/results');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.isGameOver, state.players, navigate]);

  const currentPlayer = state.players[state.activePlayerIndex];

  return (
    <div className={styles.page}>
      <WeddingHeader title="Memory Game" />
      <ScoreBoard
        players={state.players}
        activePlayerIndex={state.activePlayerIndex}
      />
      <TurnIndicator playerName={currentPlayer.name} />
      <CardGrid cards={state.cards} onCardClick={flipCard} />

      {state.isGameOver && (
        <div className={styles.gameOver}>
          <p className={styles.gameOverText}>All pairs found!</p>
        </div>
      )}
    </div>
  );
}
