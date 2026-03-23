import { useState, useEffect } from 'react';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { Button } from '../components/ui/Button';
import { getPairCount } from '../storage/db';
import styles from './HomePage.module.css';

export function HomePage() {
  const [pairCount, setPairCount] = useState(0);

  useEffect(() => {
    getPairCount().then(setPairCount);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <WeddingHeader
          title="Hochzeitsmemory"
          subtitle="Ein besonderes Spiel für einen besonderen Tag"
        />

        <div className={styles.buttons}>
          <Button variant="secondary" to="/admin">
            Spiel einrichten
          </Button>
          {pairCount >= 2 ? (
            <Button variant="gold" to="/admin">
              Los geht's!
            </Button>
          ) : (
            <Button variant="gold" disabled>
              Los geht's!
            </Button>
          )}
        </div>

        {pairCount < 2 && (
          <p className={styles.hint}>
            Lade mindestens 2 Bildpaare hoch, um zu spielen
          </p>
        )}

        {pairCount >= 2 && (
          <p className={styles.ready}>
            {pairCount} {pairCount !== 1 ? 'Bildpaare' : 'Bildpaar'} sind bereit
          </p>
        )}
      </div>
    </div>
  );
}
