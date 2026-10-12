'use client';

import { useEffect, useRef } from 'react';
import { mountJanithIntro } from './janith-intro.mjs';

/** Place once beside your EXISTING home page. No new homepage markup. */
export default function JanithIntro({
  imageUrl = '/intro/valley.jpg',
  oncePerSession = true,
  onComplete,
}) {
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    const intro = mountJanithIntro({
      imageUrl,
      oncePerSession,
      onComplete: reason => callback.current?.(reason),
    });
    return () => intro.destroy();
  }, [imageUrl, oncePerSession]);
  return null;
}
