import { SentryDevTools } from '../components/SentryDevTools';
import '../components/SentryDevTools.css';
import { useSentryToolbar } from '../hooks/useSentryToolbar';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  useSentryToolbar({
    organizationSlug: 'rc-sentry-projects',
    projectIdOrSlug: 'bolt-sentry-simulator',
  });

  return (
    <>
      <Component {...pageProps} />
      <SentryDevTools />
    </>
  );
}

export default MyApp; 