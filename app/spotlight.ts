export async function initSpotlight() {
  if (typeof window !== 'undefined') {
    const { init } = await import('@spotlightjs/spotlight');
    init();
  }
}
