import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { getPairCount } from '../storage/db';
import styles from './PlayerSetupPage.module.css';

export function PlayerSetupPage() {
  const navigate = useNavigate();
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [pairCount, setPairCount] = useState(0);

  useEffect(() => {
    getPairCount().then(setPairCount);
  }, []);

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updateName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const handleStart = () => {
    const names = playerNames.map((name, i) =>
      name.trim() || `Player ${i + 1}`
    );
    sessionStorage.setItem('players', JSON.stringify(names));
    navigate('/game');
  };

  const canStart = pairCount >= 2;

  return (
    <div className={styles.page}>
      <WeddingHeader
        title="Who's Playing?"
        subtitle="Enter the names of each player"
      />

      <div className={styles.playerList}>
        {playerNames.map((name, i) => (
          <div key={i} className={styles.playerRow}>
            <Input
              id={`player-${i}`}
              placeholder={`Player ${i + 1}`}
              value={name}
              onChange={(e) => updateName(i, e.target.value)}
            />
            {playerNames.length > 2 && (
              <button
                className={styles.removeBtn}
                onClick={() => removePlayer(i)}
                title="Remove player"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      {playerNames.length < 8 && (
        <button className={styles.addBtn} onClick={addPlayer}>
          + Add Player
        </button>
      )}

      {!canStart && (
        <p className={styles.warning}>
          You need at least 2 image pairs to play.{' '}
          <Button variant="secondary" to="/admin">
            Set up pairs
          </Button>
        </p>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" to="/">
          Back
        </Button>
        <Button variant="gold" onClick={handleStart} disabled={!canStart}>
          Start Game
        </Button>
      </div>
    </div>
  );
}
