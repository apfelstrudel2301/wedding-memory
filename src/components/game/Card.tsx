import styles from './Card.module.css';

interface CardProps {
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchColor?: string;
  onClick: () => void;
}

export function Card({ imageUrl, isFlipped, isMatched, matchColor, onClick }: CardProps) {
  const className = [
    styles.card,
    isFlipped || isMatched ? styles.flipped : '',
    isMatched ? styles.matched : '',
  ].join(' ');

  const style = isMatched && matchColor
    ? { '--match-color': matchColor } as React.CSSProperties
    : undefined;

  return (
    <div className={className} onClick={onClick} style={style}>
      <div className={styles.inner}>
        <div className={styles.back}>
          <div className={styles.backDesign}>
            <div className={styles.backPattern}>
              <span className={styles.backHeart}>&hearts;</span>
            </div>
          </div>
        </div>
        <div className={styles.front}>
          <img src={imageUrl} alt="Karte" className={styles.image} />
        </div>
      </div>
    </div>
  );
}
