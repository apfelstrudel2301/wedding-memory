import type { Player } from '../../types';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  players: Player[];
  activePlayerIndex: number;
}

export function ScoreBoard({ players, activePlayerIndex }: ScoreBoardProps) {
  return (
    <div className={styles.board}>
      {players.map((player, i) => (
        <div
          key={player.id}
          className={`${styles.player} ${i === activePlayerIndex ? styles.active : ''}`}
        >
          <span className={styles.name}>{player.name}</span>
          <span className={styles.score}>{player.score}</span>
        </div>
      ))}
    </div>
  );
}
