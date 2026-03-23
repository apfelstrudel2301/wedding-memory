import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { UploadedImage, ImagePair } from '../types';

interface MemoryGameDB extends DBSchema {
  'images': {
    key: string;
    value: UploadedImage;
    indexes: { 'by-date': number };
  };
  'image-pairs': {
    key: string;
    value: ImagePair;
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'wedding-memory-game';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<MemoryGameDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MemoryGameDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        if (oldVersion < 1) {
          const pairStore = db.createObjectStore('image-pairs', { keyPath: 'id' });
          pairStore.createIndex('by-date', 'createdAt');
        }
        if (oldVersion < 2) {
          const imageStore = db.createObjectStore('images', { keyPath: 'id' });
          imageStore.createIndex('by-date', 'createdAt');
          // Clear old pairs since they stored blobs directly
          if (oldVersion >= 1) {
            transaction.objectStore('image-pairs').clear();
          }
        }
      },
    });
  }
  return dbPromise;
}

// --- Images ---

export async function saveImage(image: UploadedImage): Promise<void> {
  const db = await getDB();
  await db.put('images', image);
}

export async function saveImages(images: UploadedImage[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('images', 'readwrite');
  await Promise.all([
    ...images.map(img => tx.store.put(img)),
    tx.done,
  ]);
}

export async function getImage(id: string): Promise<UploadedImage | undefined> {
  const db = await getDB();
  return db.get('images', id);
}

export async function getAllImages(): Promise<UploadedImage[]> {
  const db = await getDB();
  return db.getAllFromIndex('images', 'by-date');
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('images', id);
}

// --- Pairs ---

export async function savePair(pair: ImagePair): Promise<void> {
  const db = await getDB();
  await db.put('image-pairs', pair);
}

export async function getAllPairs(): Promise<ImagePair[]> {
  const db = await getDB();
  return db.getAllFromIndex('image-pairs', 'by-date');
}

export async function deletePair(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('image-pairs', id);
}

// --- Bulk operations ---

export async function clearAllPairs(): Promise<void> {
  const db = await getDB();
  await db.clear('image-pairs');
}

export async function clearAll(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['images', 'image-pairs'], 'readwrite');
  await Promise.all([
    tx.objectStore('images').clear(),
    tx.objectStore('image-pairs').clear(),
    tx.done,
  ]);
}

export async function getPairCount(): Promise<number> {
  const db = await getDB();
  return db.count('image-pairs');
}
