'use client';

import { useEffect } from 'react';
import { initSpotlight } from '../spotlight';

export function SpotlightInitializer() {
  useEffect(() => {
    initSpotlight();
  }, []);

  return null;
}
