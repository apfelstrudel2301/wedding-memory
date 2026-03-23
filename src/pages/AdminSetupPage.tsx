import { useState } from 'react';
import { WeddingHeader } from '../components/layout/WeddingHeader';
import { ImageUploader } from '../components/admin/ImageUploader';
import { ImagePool } from '../components/admin/ImagePool';
import { PairList } from '../components/admin/PairList';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useImagePairs } from '../hooks/useImagePairs';
import styles from './AdminSetupPage.module.css';

export function AdminSetupPage() {
  const {
    images, pairs, unpairedImages, loading,
    uploadImages, createPair, removePair, removeImage, removeAll,
  } = useImagePairs();
  const [showClearModal, setShowClearModal] = useState(false);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <WeddingHeader
        title="Set Up the Game"
        subtitle="Upload images and pair them together"
      />

      <ImageUploader onUpload={uploadImages} />
      <ImagePool
        images={unpairedImages}
        onCreatePair={createPair}
        onDeleteImage={removeImage}
      />
      <PairList pairs={pairs} images={images} onUnpair={removePair} />

      <div className={styles.actions}>
        {(images.length > 0 || pairs.length > 0) && (
          <Button variant="danger" onClick={() => setShowClearModal(true)}>
            Clear All
          </Button>
        )}
        {pairs.length >= 2 && (
          <Button variant="gold" to="/players">
            Start Game
          </Button>
        )}
        <Button variant="secondary" to="/">
          Back to Home
        </Button>
      </div>

      <Modal
        open={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All?"
      >
        <p className={styles.modalText}>
          This will permanently delete all uploaded images and pairs.
        </p>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              removeAll();
              setShowClearModal(false);
            }}
          >
            Delete All
          </Button>
        </div>
      </Modal>
    </div>
  );
}
