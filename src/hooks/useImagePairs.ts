import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UploadedImage, ImagePair } from '../types';
import {
  getAllImages, saveImages, deleteImage as dbDeleteImage,
  getAllPairs, savePair, deletePair as dbDeletePair,
  clearAll,
} from '../storage/db';
import { compressImage } from '../utils/compressImage';

const MAX_IMAGES = 100;

export function useImagePairs() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pairs, setPairs] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [imgs, prs] = await Promise.all([getAllImages(), getAllPairs()]);
    setImages(imgs);
    setPairs(prs);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const pairedImageIds = useMemo(() => {
    const ids = new Set<string>();
    for (const p of pairs) {
      ids.add(p.imageAId);
      ids.add(p.imageBId);
    }
    return ids;
  }, [pairs]);

  const unpairedImages = useMemo(
    () => images.filter(img => !pairedImageIds.has(img.id)),
    [images, pairedImageIds],
  );

  const uploadImages = useCallback(async (files: File[]) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      throw new Error(`Maximale Anzahl von ${MAX_IMAGES} Bildern erreicht.`);
    }
    const toUpload = files.slice(0, remaining);
    const compressed = await Promise.all(toUpload.map(f => compressImage(f)));
    const newImages: UploadedImage[] = compressed.map(blob => ({
      id: crypto.randomUUID(),
      image: blob,
      createdAt: Date.now(),
    }));
    await saveImages(newImages);
    setImages(prev => [...prev, ...newImages]);
  }, [images.length]);

  const createPair = useCallback(async (imageAId: string, imageBId: string) => {
    const pair: ImagePair = {
      id: crypto.randomUUID(),
      imageAId,
      imageBId,
      createdAt: Date.now(),
    };
    await savePair(pair);
    setPairs(prev => [...prev, pair]);
  }, []);

  const removePair = useCallback(async (pairId: string) => {
    await dbDeletePair(pairId);
    setPairs(prev => prev.filter(p => p.id !== pairId));
    // Images stay in the images store — they return to the unpaired pool
  }, []);

  const removeImage = useCallback(async (imageId: string) => {
    await dbDeleteImage(imageId);
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const removeAll = useCallback(async () => {
    await clearAll();
    setImages([]);
    setPairs([]);
  }, []);

  return {
    images,
    pairs,
    unpairedImages,
    loading,
    uploadImages,
    createPair,
    removePair,
    removeImage,
    removeAll,
    reload: loadAll,
  };
}
