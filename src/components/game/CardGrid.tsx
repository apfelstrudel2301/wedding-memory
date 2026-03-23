import { useRef, useState, useEffect } from 'react';
import type { GameCard } from '../../types';
import { Card } from './Card';
import styles from './CardGrid.module.css';

interface CardGridProps {
  cards: GameCard[];
  onCardClick: (cardId: string) => void;
}

const GAP = 12;

function computeGrid(width: number, height: number, count: number) {
  let bestSize = 0;
  let bestCols = 1;
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cardW = (width - (cols - 1) * GAP) / cols;
    const cardH = (height - (rows - 1) * GAP) / rows;
    const size = Math.min(cardW, cardH);
    if (size > bestSize) {
      bestSize = size;
      bestCols = cols;
    }
  }
  return { cardSize: Math.floor(bestSize), cols: bestCols };
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ cardSize: 0, cols: 4 });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setLayout(computeGrid(width, height, cards.length));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [cards.length]);

  return (
    <div
      ref={gridRef}
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, ${layout.cardSize}px)`,
        gridAutoRows: `${layout.cardSize}px`,
      }}
    >
      {layout.cardSize > 0 && cards.map(card => (
        <Card
          key={card.id}
          imageUrl={card.imageUrl}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          matchColor={card.matchColor}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
