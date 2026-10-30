'use client';

import React, { useState, useEffect } from 'react';
import { VideoPost } from '@/types';
import { VideoStorage } from '@/lib/videoStorage';

interface VideoThumbnailProps {
  video: VideoPost;
  className?: string;
  alt?: string;
}

export function VideoThumbnail({
  video,
  className = 'w-full h-full object-cover',
  alt,
}: VideoThumbnailProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');

  // Determine whether video has an authentic real frame thumbnail
  const thumb = video.thumbnail_url || '';
  const isRealDataOrBlobThumb =
    thumb.startsWith('data:image/') || thumb.startsWith('blob:');

  useEffect(() => {
    // If not a data/blob thumbnail, resolve playable video URL so HTML5 video can natively display its first frame
    if (!isRealDataOrBlobThumb) {
      VideoStorage.resolvePlayableUrl(video.id, video.video_url).then((url) => {
        setResolvedUrl(url);
      });
    }
  }, [video.id, video.video_url, isRealDataOrBlobThumb]);

  // If we have an authentic real captured frame (data URL or blob)
  if (isRealDataOrBlobThumb) {
    return (
      <img
        src={thumb}
        alt={alt || video.title || video.caption || 'Video thumbnail'}
        className={className}
      />
    );
  }

  // Otherwise, use native video first-frame rendering (never show unrelated stock photos)
  const videoSrc = resolvedUrl || video.video_url;

  return (
    <video
      src={videoSrc}
      preload="metadata"
      muted
      playsInline
      className={`${className} pointer-events-none select-none`}
    />
  );
}

