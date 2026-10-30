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

  /**
   * Extract a real frame thumbnail directly from a video file using Canvas
   */
  static generateVideoThumbnail(file: File): Promise<string> {
    if (typeof window === 'undefined') return Promise.resolve('');

    return new Promise((resolve) => {
      let resolved = false;
      const finish = (result: string, objUrl?: string) => {
        if (resolved) return;
        resolved = true;
        if (objUrl) {
          try {
            URL.revokeObjectURL(objUrl);
          } catch {}
        }
        resolve(result);
      };

      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;

        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;

        const captureFrame = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(640, video.videoWidth || 480);
            canvas.height = Math.min(360, video.videoHeight || 270);
            const ctx = canvas.getContext('2d');
            if (ctx && canvas.width > 0 && canvas.height > 0) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              finish(dataUrl, objectUrl);
              return;
            }
          } catch {}
          finish('', objectUrl);
        };

        video.onloadedmetadata = () => {
          video.currentTime = Math.min(0.3, (video.duration || 1) / 2);
        };

        video.onseeked = captureFrame;
        video.onerror = () => finish('', objectUrl);

        // Safety timeout
        setTimeout(() => finish('', objectUrl), 4000);
      } catch {
        finish('');
      }
    });
  }

  /**
   * Extract a real frame thumbnail from a video URL using Canvas
   */
  static generateThumbnailFromUrl(videoUrl: string): Promise<string> {
    if (typeof window === 'undefined' || !videoUrl) return Promise.resolve('');

    return new Promise((resolve) => {
      let resolved = false;
      const finish = (result: string) => {
        if (resolved) return;
        resolved = true;
        resolve(result);
      };

      try {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.src = videoUrl;

        video.onloadedmetadata = () => {
          video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(640, video.videoWidth || 480);
            canvas.height = Math.min(360, video.videoHeight || 270);
            const ctx = canvas.getContext('2d');
            if (ctx && canvas.width > 0 && canvas.height > 0) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              finish(dataUrl);
              return;
            }
          } catch {}
          finish('');
        };

        video.onerror = () => finish('');
        setTimeout(() => finish(''), 3000);
      } catch {
        finish('');
      }
    });
  }
}

