'use client';

// In-memory cache for live Blob URLs
const activeUrlCache = new Map<string, string>();

const DB_NAME = 'SkillBridgeMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_videos';

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export class VideoStorage {
  /**
   * Save a local video file to browser IndexedDB
   */
  static async saveVideoBlob(id: string, file: File | Blob): Promise<string> {
    if (typeof window === 'undefined') return '';

    // Cache the live Object URL immediately for this session
    const objectUrl = URL.createObjectURL(file);
    activeUrlCache.set(id, objectUrl);

    try {
      const db = await openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id, blob: file, createdAt: Date.now() });
      }
    } catch (e) {
      console.warn('[VideoStorage] IndexedDB save notice:', e);
    }

    return objectUrl;
  }

  /**
   * Retrieve a playable video URL for any video post
   */
  static async resolvePlayableUrl(id: string, remoteUrl?: string): Promise<string> {
    if (typeof window === 'undefined') {
      return remoteUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
    }

    // 1. Check in-memory active Blob URL
    if (activeUrlCache.has(id)) {
      return activeUrlCache.get(id)!;
    }

    // 2. Check IndexedDB for the stored local file
    try {
      const db = await openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);

        const record = await new Promise<{ id: string; blob: Blob } | null>((resolve) => {
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => resolve(null);
        });

        if (record && record.blob) {
          const freshUrl = URL.createObjectURL(record.blob);
          activeUrlCache.set(id, freshUrl);
          return freshUrl;
        }
      }
    } catch (e) {
      console.warn('[VideoStorage] IndexedDB read notice:', e);
    }

    // 3. If remoteUrl is a valid http(s) URL and NOT an expired blob URL, use it
    if (remoteUrl && remoteUrl.startsWith('http') && !remoteUrl.startsWith('blob:')) {
      // If it's the dead google cloud storage URL, fallback to reliable stream
      if (remoteUrl.includes('commondatastorage.googleapis.com')) {
        return 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
      }
      return remoteUrl;
    }

    // 4. Default high-speed fallback
    return 'https://www.w3schools.com/html/mov_bbb.mp4';
  }
}
