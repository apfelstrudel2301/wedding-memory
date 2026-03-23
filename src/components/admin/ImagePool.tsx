import { useState, useEffect } from 'react';
import type { UploadedImage } from '../../types';
import styles from './ImagePool.module.css';

interface ImagePoolProps {
  images: UploadedImage[];
  onCreatePair: (imageAId: string, imageBId: string) => Promise<void>;
  onDeleteImage: (id: string) => void;
}

function PoolThumbnail({
  image,
  isSelected,
  onClick,
  onDelete,
}: {
  image: UploadedImage;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image.image);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image.image]);

  return (
    <div
      className={`${styles.thumb} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {url && <img src={url} alt="" className={styles.thumbImg} />}
      <button
        className={styles.deleteBtn}
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Bild entfernen"
      >
        &times;
      </button>
    </div>
  );
}

export function ImagePool({ images, onCreatePair, onDeleteImage }: ImagePoolProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Clear selection if the selected image is no longer in the pool
  useEffect(() => {
    if (selectedId && !images.some(img => img.id === selectedId)) {
      setSelectedId(null);
    }
  }, [images, selectedId]);

  const handleClick = async (id: string) => {
    if (!selectedId) {
      setSelectedId(id);
      return;
    }
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    // Second image clicked — create pair
    await onCreatePair(selectedId, id);
    setSelectedId(null);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.pool}>
      <h3 className={styles.heading}>Nicht zugeordnete Bilder</h3>
      <p className={styles.hint}>
        {selectedId
          ? 'Wähle jetzt das zweite Bild, um das Paar zu vervollständigen'
          : 'Wähle zwei Bilder aus, um ein Paar zu erstellen'}
      </p>
      <div className={styles.grid}>
        {images.map(img => (
          <PoolThumbnail
            key={img.id}
            image={img}
            isSelected={img.id === selectedId}
            onClick={() => handleClick(img.id)}
            onDelete={() => onDeleteImage(img.id)}
          />
        ))}
      </div>
    </div>
  );
}
