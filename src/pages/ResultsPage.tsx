import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { Button } from '../components/ui/Button';
import type { Player } from '../types';
import styles from './ResultsPage.module.css';

export function ResultsPage() {
  const navigate = useNavigate();

  const players = useMemo(() => {
    const data = sessionStorage.getItem('results');
    if (!data) return [];
    return (JSON.parse(data) as Player[]).sort((a, b) => b.score - a.score);
  }, []);

  if (players.length === 0) {
    navigate('/');
    return null;
  }

  const highScore = players[0].score;
  const winners = players.filter(p => p.score === highScore);
  const isTie = winners.length > 1;

  return (
    <div className={styles.page}>
      <WeddingHeader
        title={isTie ? "It's a Tie!" : `${winners[0].name} Wins!`}
        subtitle="What a wonderful game"
      />

      <div className={styles.celebration}>
        <span className={styles.trophy}>&#10029;</span>
      </div>

      <div className={styles.scores}>
        {players.map((player, i) => {
          const isWinner = player.score === highScore;
          return (
            <div
              key={player.id}
              className={`${styles.playerRow} ${isWinner ? styles.winner : ''}`}
            >
              <span className={styles.rank}>{i + 1}</span>
              <span className={styles.name}>{player.name}</span>
              <span className={styles.score}>
                {player.score} pair{player.score !== 1 ? 's' : ''}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" to="/players">
          Play Again
        </Button>
        <Button variant="gold" to="/">
          Home
        </Button>
      </div>
    </div>
  );
}
