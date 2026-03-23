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
          title="Memory Game"
          subtitle="A special game for a special day"
        />

        <div className={styles.buttons}>
          <Button variant="secondary" to="/admin">
            Set Up Game
          </Button>
          {pairCount >= 2 ? (
            <Button variant="gold" to="/players">
              Play!
            </Button>
          ) : (
            <Button variant="gold" disabled>
              Play!
            </Button>
          )}
        </div>

        {pairCount < 2 && (
          <p className={styles.hint}>
            Upload at least 2 image pairs to start playing
          </p>
        )}

        {pairCount >= 2 && (
          <p className={styles.ready}>
            {pairCount} pair{pairCount !== 1 ? 's' : ''} ready
          </p>
        )}
      </div>
    </div>
  );
}
