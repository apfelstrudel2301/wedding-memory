import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { ImageUploader } from '../components/admin/ImageUploader';
import { ImagePool } from '../components/admin/ImagePool';
import { PairList } from '../components/admin/PairList';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useImagePairs } from '../hooks/useImagePairs';
import styles from './AdminSetupPage.module.css';

export function AdminSetupPage() {
  const navigate = useNavigate();
  const {
    images, pairs, unpairedImages, loading,
    uploadImages, createPair, removePair, removeImage, removeAll,
  } = useImagePairs();
  const [showClearModal, setShowClearModal] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [playerNames, setPlayerNames] = useState(['']);

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
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
      name.trim() || `Spieler ${i + 1}`
    );
    sessionStorage.setItem('players', JSON.stringify(names));
    sessionStorage.setItem('gameTitle', gameTitle.trim() || 'Hochzeitsmemory');
    navigate('/game');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <WeddingHeader
        title="Spiel einrichten"
        subtitle="Bilder hochladen und zu Paaren zusammenstellen"
      />

      <ImageUploader onUpload={uploadImages} />
      <ImagePool
        images={unpairedImages}
        onCreatePair={createPair}
        onDeleteImage={removeImage}
      />
      <PairList pairs={pairs} images={images} onUnpair={removePair} />

      <div className={styles.playerSection}>
        <h3 className={styles.playerHeading}>Spieltitel</h3>
        <Input
          id="game-title"
          placeholder="Hochzeitsmemory"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
        />
      </div>

      <div className={styles.playerSection}>
        <h3 className={styles.playerHeading}>Spieler</h3>
        <div className={styles.playerList}>
          {playerNames.map((name, i) => (
            <div key={i} className={styles.playerRow}>
              <Input
                id={`player-${i}`}
                placeholder={`Spieler ${i + 1}`}
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
              />
              {playerNames.length > 1 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => removePlayer(i)}
                  title="Spieler entfernen"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        {playerNames.length < 8 && (
          <button className={styles.addBtn} onClick={addPlayer}>
            + Spieler hinzufügen
          </button>
        )}
      </div>

      <div className={styles.actions}>
        {(images.length > 0 || pairs.length > 0) && (
          <Button variant="danger" onClick={() => setShowClearModal(true)}>
            Alles löschen
          </Button>
        )}
        <span title={pairs.length < 2 ? 'Bitte zuerst Bilder hochladen und mindestens 2 Paare erstellen' : undefined}>
          <Button variant="gold" onClick={handleStart} disabled={pairs.length < 2}>
            Spiel starten
          </Button>
        </span>
        <Button variant="secondary" to="/">
          Zurück zur Startseite
        </Button>
      </div>

      <Modal
        open={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Alles löschen?"
      >
        <p className={styles.modalText}>
          Dies löscht alle hochgeladenen Bilder und Paare dauerhaft.
        </p>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Abbrechen
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              removeAll();
              setShowClearModal(false);
            }}
          >
            Alles entfernen
          </Button>
        </div>
      </Modal>
    </div>
  );
}
