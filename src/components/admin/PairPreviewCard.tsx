import { useEffect, useState } from 'react';
import type { ImagePair, UploadedImage } from '../../types';
import styles from './PairPreviewCard.module.css';

interface PairPreviewCardProps {
  pair: ImagePair;
  images: UploadedImage[];
  onUnpair: (id: string) => void;
}

export function PairPreviewCard({ pair, images, onUnpair }: PairPreviewCardProps) {
  const [urlA, setUrlA] = useState<string | null>(null);
  const [urlB, setUrlB] = useState<string | null>(null);

  const imageA = images.find(img => img.id === pair.imageAId);
  const imageB = images.find(img => img.id === pair.imageBId);

  useEffect(() => {
    if (!imageA || !imageB) return;
    const a = URL.createObjectURL(imageA.image);
    const b = URL.createObjectURL(imageB.image);
    setUrlA(a);
    setUrlB(b);
    return () => {
      URL.revokeObjectURL(a);
      URL.revokeObjectURL(b);
    };
  }, [imageA, imageB]);

  if (!imageA || !imageB) return null;

  return (
    <div className={styles.card}>
      <div className={styles.images}>
        {urlA && <img src={urlA} alt="Image A" className={styles.thumb} />}
        <span className={styles.pairSymbol}>&harr;</span>
        {urlB && <img src={urlB} alt="Image B" className={styles.thumb} />}
      </div>
      <button
        className={styles.deleteBtn}
        onClick={() => onUnpair(pair.id)}
        title="Unpair images"
      >
        &times;
      </button>
    </div>
  );
}
