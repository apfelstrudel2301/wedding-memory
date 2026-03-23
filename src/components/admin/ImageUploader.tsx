import { useState, useRef, type DragEvent } from 'react';
import styles from './ImageUploader.module.css';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList) => {
    setError(null);
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    const oversized = files.filter(f => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(`${oversized.length} Datei(en) überschreiten das Limit von 20 MB und wurden ignoriert.`);
      const valid = files.filter(f => f.size <= MAX_FILE_SIZE);
      if (valid.length === 0) return;
      return handleValidFiles(valid);
    }
    return handleValidFiles(files);
  };

  const handleValidFiles = async (files: File[]) => {
    setUploading(true);
    try {
      await onUpload(files);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={styles.uploader}>
      <h3 className={styles.heading}>Bilder hochladen</h3>
      <p className={styles.storageHint}>
        Alle Bilder werden nur lokal in deinem Browser gespeichert und nicht auf einen Server hochgeladen.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={(e) => { handleDrag(e); setIsDragging(true); }}
        onDragLeave={(e) => { handleDrag(e); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className={styles.placeholder}>
            <span className={styles.label}>Bilder werden komprimiert...</span>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>+</span>
            <span className={styles.label}>Bilder hierher ziehen oder klicken</span>
            <span className={styles.hint}>Mehrere Dateien gleichzeitig auswählen</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInput}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
