import { init } from '@spotlightjs/spotlight';

export function initSpotlight() {
  if (typeof window !== 'undefined') {
    init();
  }
}
