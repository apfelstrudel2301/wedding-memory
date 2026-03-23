import { useState, useRef, type DragEvent } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setUploading(true);
    try {
      await onUpload(files);
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
      <h3 className={styles.heading}>Upload Images</h3>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={(e) => { handleDrag(e); setIsDragging(true); }}
        onDragLeave={(e) => { handleDrag(e); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className={styles.placeholder}>
            <span className={styles.label}>Compressing images...</span>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>+</span>
            <span className={styles.label}>Drop images or click to select</span>
            <span className={styles.hint}>Select multiple files at once</span>
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
