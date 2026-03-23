import type { Player } from '../../types';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  players: Player[];
  activePlayerIndex: number;
  moves?: number;
}

export function ScoreBoard({ players, activePlayerIndex, moves }: ScoreBoardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        {players.map((player, i) => (
          <div
            key={player.id}
            className={`${styles.player} ${i === activePlayerIndex ? styles.active : ''}`}
          >
            <span className={styles.name}>
              {i === activePlayerIndex && <span className={styles.arrow}>&rsaquo;</span>}
              {player.name}
            </span>
            <span className={styles.score}>{player.score}</span>
          </div>
        ))}
      </div>
      {moves != null && (
        <p className={styles.moves}>Versuche: {moves}</p>
      )}
    </div>
  );
}
