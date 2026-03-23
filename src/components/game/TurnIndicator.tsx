import styles from './TurnIndicator.module.css';

interface TurnIndicatorProps {
  playerName: string;
}

export function TurnIndicator({ playerName }: TurnIndicatorProps) {
  return (
    <div className={styles.indicator} key={playerName}>
      <span className={styles.text}>{playerName} ist dran</span>
    </div>
  );
}
