'use client';

import { useEffect } from 'react';
import { initSpotlight } from '../spotlight';

export function SpotlightInitializer() {
  useEffect(() => {
    const init = async () => {
      try {
        await initSpotlight();
      } catch (error) {
        console.error('Failed to initialize Spotlight:', error);
      }
    };
    
    init();
  }, []);

  return null;
}
