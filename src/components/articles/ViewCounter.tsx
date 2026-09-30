'use client';

import { useEffect, useRef } from 'react';

interface ViewCounterProps {
  articleIdOrSlug: string;
}

export default function ViewCounter({ articleIdOrSlug }: ViewCounterProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current && articleIdOrSlug) {
      hasIncremented.current = true;
      fetch(`/api/articles/${articleIdOrSlug}/views`, {
        method: 'POST',
      }).catch((err) => {
        console.warn('Could not increment view count:', err);
      });
    }
  }, [articleIdOrSlug]);

  return null;
}
