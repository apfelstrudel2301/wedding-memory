import styles from './Card.module.css';

interface CardProps {
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export function Card({ imageUrl, isFlipped, isMatched, onClick }: CardProps) {
  const className = [
    styles.card,
    isFlipped || isMatched ? styles.flipped : '',
    isMatched ? styles.matched : '',
  ].join(' ');

  return (
    <div className={className} onClick={onClick}>
      <div className={styles.inner}>
        <div className={styles.back}>
          <div className={styles.backDesign}>
            <div className={styles.backPattern}>
              <span className={styles.backHeart}>&hearts;</span>
            </div>
          </div>
        </div>
        <div className={styles.front}>
          <img src={imageUrl} alt="Card" className={styles.image} />
        </div>
      </div>
    </div>
  );
}
