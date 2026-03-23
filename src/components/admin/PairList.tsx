import type { ImagePair, UploadedImage } from '../../types';
import { PairPreviewCard } from './PairPreviewCard';
import styles from './PairList.module.css';

interface PairListProps {
  pairs: ImagePair[];
  images: UploadedImage[];
  onUnpair: (id: string) => void;
}

export function PairList({ pairs, images, onUnpair }: PairListProps) {
  if (pairs.length === 0) {
    return (
      <p className={styles.empty}>
        No pairs yet. Upload images and select two to create a pair.
      </p>
    );
  }

  return (
    <div>
      <p className={styles.count}>
        {pairs.length} pair{pairs.length !== 1 ? 's' : ''} saved ({pairs.length * 2} cards)
      </p>
      <div className={styles.grid}>
        {pairs.map(pair => (
          <PairPreviewCard key={pair.id} pair={pair} images={images} onUnpair={onUnpair} />
        ))}
      </div>
    </div>
  );
}
