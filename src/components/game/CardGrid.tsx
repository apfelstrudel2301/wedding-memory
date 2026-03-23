import type { GameCard } from '../../types';
import { Card } from './Card';
import styles from './CardGrid.module.css';

interface CardGridProps {
  cards: GameCard[];
  onCardClick: (cardId: string) => void;
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  return (
    <div className={styles.grid}>
      {cards.map(card => (
        <Card
          key={card.id}
          imageUrl={card.imageUrl}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
