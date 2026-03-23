import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { CardGrid } from '../components/game/CardGrid';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { Fireworks } from '../components/game/Fireworks';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useGameLogic, createCardsFromPairs } from '../hooks/useGameLogic';
import { getAllPairs, getAllImages } from '../storage/db';
import type { Player, GameCard } from '../types';
import styles from './GameBoardPage.module.css';

export function GameBoardPage() {
  const navigate = useNavigate();
  const [initialCards, setInitialCards] = useState<GameCard[] | null>(null);
  const [initialPlayers, setInitialPlayers] = useState<Player[] | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [gameTitle, setGameTitle] = useState('Hochzeitsmemory');

  useEffect(() => {
    let playerNames: string[];
    try {
      const raw = JSON.parse(sessionStorage.getItem('players') || '[]');
      playerNames = Array.isArray(raw) ? raw.filter((n): n is string => typeof n === 'string') : [];
    } catch {
      playerNames = [];
    }
    if (playerNames.length < 1) {
      navigate('/admin');
      return;
    }

    setGameTitle(sessionStorage.getItem('gameTitle') || 'Hochzeitsmemory');

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
        <p>Spiel wird geladen...</p>
      </div>
    );
  }

  return <GameBoard initialCards={initialCards} initialPlayers={initialPlayers} gameTitle={gameTitle} />;
}

function GameBoard({
  initialCards,
  initialPlayers,
  gameTitle,
}: {
  initialCards: GameCard[];
  initialPlayers: Player[];
  gameTitle: string;
}) {
  const navigate = useNavigate();
  const { state, flipCard } = useGameLogic(initialCards, initialPlayers);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [matchPreview, setMatchPreview] = useState<{ imageA: string; imageB: string } | null>(null);
  const [compact, setCompact] = useState(() => window.innerHeight < 700);

  useEffect(() => {
    const mql = window.matchMedia('(max-height: 699px)');
    const handler = (e: MediaQueryListEvent) => setCompact(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const matchedPairIds = useMemo(
    () => new Set(state.cards.filter(c => c.isMatched).map(c => c.pairId)),
    [state.cards]
  );
  const prevMatchedPairIdsRef = useRef(matchedPairIds);

  useEffect(() => {
    if (matchedPairIds.size > prevMatchedPairIdsRef.current.size) {
      // Find the newly matched pairId
      for (const pairId of matchedPairIds) {
        if (!prevMatchedPairIdsRef.current.has(pairId)) {
          const matched = state.cards.filter(c => c.pairId === pairId);
          if (matched.length === 2) {
            setMatchPreview({ imageA: matched[0].imageUrl, imageB: matched[1].imageUrl });
            prevMatchedPairIdsRef.current = matchedPairIds;

            setShowFireworks(true);
            const fireworksTimer = setTimeout(() => setShowFireworks(false), 1200);

            return () => {
              clearTimeout(fireworksTimer);
            };
          }
        }
      }
    }
    prevMatchedPairIdsRef.current = matchedPairIds;
  }, [matchedPairIds, state.cards]);

  const [gameOverFireworks, setGameOverFireworks] = useState(false);

  const dismissMatchPreview = () => {
    setMatchPreview(null);
    if (state.isGameOver) {
      setShowFireworks(false);
      // Brief delay so the Fireworks component remounts with high intensity
      requestAnimationFrame(() => {
        setGameOverFireworks(true);
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 8000);
      });
    }
  };

  return (
    <div className={styles.page}>
      <button
        className={styles.exitButton}
        onClick={() => setShowExitModal(true)}
        aria-label="Spiel beenden"
      >
        &times;
      </button>
      <Modal open={showExitModal} onClose={() => setShowExitModal(false)} title="Spiel beenden?">
        <div className={styles.exitActions}>
          <Button variant="danger" onClick={() => navigate('/')}>Beenden</Button>
          <Button variant="secondary" onClick={() => setShowExitModal(false)}>Weiterspielen</Button>
        </div>
      </Modal>
      <WeddingHeader title={gameTitle} compact={compact} />
      <ScoreBoard
        players={state.players}
        activePlayerIndex={state.activePlayerIndex}
        moves={state.players.length === 1 ? state.moves : undefined}
      />
      <CardGrid cards={state.cards} onCardClick={flipCard} />

      {matchPreview && (
        <div className={styles.matchPreviewOverlay} onClick={dismissMatchPreview}>
          <div className={styles.matchPreviewImages}>
            <img src={matchPreview.imageA} className={styles.matchPreviewImage} alt="" />
            <img src={matchPreview.imageB} className={styles.matchPreviewImage} alt="" />
          </div>
        </div>
      )}

      <Fireworks active={showFireworks} intensity={gameOverFireworks ? 'high' : 'normal'} />
    </div>
  );
}
