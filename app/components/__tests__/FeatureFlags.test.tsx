import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { FeatureFlags } from '../FeatureFlags';
import * as Sentry from '@sentry/nextjs';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

// Mock LaunchDarkly hooks
jest.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: jest.fn(),
  useLDClient: jest.fn(),
}));

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  startTransaction: jest.fn(() => ({
    startChild: jest.fn(() => ({
      setTag: jest.fn(),
      finish: jest.fn(),
    })),
    finish: jest.fn(),
  })),
}));

describe('FeatureFlags', () => {
  const mockLDClient = {
    identify: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFlags as jest.Mock).mockReturnValue({
      newFeature: false,
      betaFeature: false,
    });
    (useLDClient as jest.Mock).mockReturnValue(mockLDClient);
  });

  it('renders feature flags status correctly', () => {
    (useFlags as jest.Mock).mockReturnValue({
      newFeature: true,
      betaFeature: false,
    });

    render(<FeatureFlags />);
    
    expect(screen.getByText('New Feature')).toBeInTheDocument();
    expect(screen.getByText('Beta Feature')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('simulates feature error with new feature enabled', async () => {
    (useFlags as jest.Mock).mockReturnValue({
      newFeature: true,
      betaFeature: false,
    });

    render(<FeatureFlags />);
    
    const errorButton = screen.getByText('Simulate Feature Error');
    fireEvent.click(errorButton);

    expect(Sentry.captureException).toHaveBeenCalledWith(
      new Error('Error in new feature'),
      {
        tags: {
          newFeature: 'true',
          betaFeature: 'false',
        },
      }
    );
  });

  it('simulates feature error with new feature disabled', async () => {
    (useFlags as jest.Mock).mockReturnValue({
      newFeature: false,
      betaFeature: false,
    });

    render(<FeatureFlags />);
    
    const errorButton = screen.getByText('Simulate Feature Error');
    fireEvent.click(errorButton);

    expect(Sentry.captureException).toHaveBeenCalledWith(
      new Error('Error in old feature'),
      {
        tags: {
          newFeature: 'false',
          betaFeature: 'false',
        },
      }
    );
  });

  it('tracks performance with transaction and spans', async () => {
    const mockTransaction = {
      startChild: jest.fn().mockReturnValue({
        setTag: jest.fn(),
        finish: jest.fn(),
      }),
      finish: jest.fn(),
    };
    (Sentry.startTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<FeatureFlags />);
    
    const performanceButton = screen.getByText('Test Feature Performance');
    fireEvent.click(performanceButton);

    expect(Sentry.startTransaction).toHaveBeenCalledWith({
      name: 'Feature Performance Test',
      op: 'feature.performance'
    });

    expect(mockTransaction.startChild).toHaveBeenCalledWith({
      op: 'feature.test',
      description: 'Testing old feature performance',
    });

    // Wait for performance simulation to complete
    await waitFor(() => {
      expect(mockTransaction.finish).toHaveBeenCalled();
    }, { timeout: 4000 });
  });

  it('updates user context', async () => {
    render(<FeatureFlags />);
    
    const contextButton = screen.getByText('Update User Context');
    fireEvent.click(contextButton);

    await waitFor(() => {
      expect(mockLDClient.identify).toHaveBeenCalledWith({
        kind: 'user',
        key: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        custom: {
          group: 'beta-testers',
        },
      });
    });
  });

  it('disables buttons while loading', async () => {
    render(<FeatureFlags />);
    
    const errorButton = screen.getByRole('button', { name: /Simulate Feature Error/i });
    const performanceButton = screen.getByRole('button', { name: /Test Feature Performance/i });
    const contextButton = screen.getByRole('button', { name: /Update User Context/i });

    await act(async () => {
      fireEvent.click(errorButton);
    });

    await waitFor(() => {
      expect(errorButton).toBeDisabled();
      expect(performanceButton).toBeDisabled();
      expect(contextButton).toBeDisabled();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(errorButton).not.toBeDisabled();
      expect(performanceButton).not.toBeDisabled();
      expect(contextButton).not.toBeDisabled();
    });
  });

  it('shows loading spinner during operations', async () => {
    render(<FeatureFlags />);
    
    const errorButton = screen.getByRole('button', { name: /Simulate Feature Error/i });
    await act(async () => {
      fireEvent.click(errorButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });
});
