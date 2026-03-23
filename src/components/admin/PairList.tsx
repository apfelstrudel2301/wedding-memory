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
        Noch keine Paare. Lade Bilder hoch und wähle zwei aus, um ein Paar zu erstellen.
      </p>
    );
  }

  return (
    <div>
      <p className={styles.count}>
        {pairs.length} {pairs.length !== 1 ? 'Paare' : 'Paar'} gespeichert ({pairs.length * 2} Karten)
      </p>
      <div className={styles.grid}>
        {pairs.map(pair => (
          <PairPreviewCard key={pair.id} pair={pair} images={images} onUnpair={onUnpair} />
        ))}
      </div>
    </div>
  );
}
