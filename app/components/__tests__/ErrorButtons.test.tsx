import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorButtons } from '../ErrorButtons';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(() => 'mock-event-id'),
}));

// Mock FeedbackDialog to avoid testing its internals
jest.mock('../FeedbackDialog', () => ({
  FeedbackDialog: jest.fn(() => null),
}));

describe('ErrorButtons', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders all error buttons', () => {
    render(<ErrorButtons />);
    
    expect(screen.getByText('Trigger Runtime Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Promise Rejection')).toBeInTheDocument();
    expect(screen.getByText('Trigger Network Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Type Error')).toBeInTheDocument();
  });

  it('feedback button is initially disabled', () => {
    render(<ErrorButtons />);
    
    const feedbackButton = screen.getByText('Provide Error Feedback');
    expect(feedbackButton).toBeDisabled();
  });

  it('handles runtime error correctly', () => {
    render(<ErrorButtons />);
    
    const button = screen.getByText('Trigger Runtime Error');
    fireEvent.click(button);

    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'This is a runtime error!'
      })
    );
  });

  it('handles promise rejection correctly', async () => {
    render(<ErrorButtons />);
    
    const button = screen.getByText('Trigger Promise Rejection');
    fireEvent.click(button);

    await waitFor(() => {
      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'This promise was rejected!'
        })
      );
    });
  });

  it('handles type error correctly', () => {
    render(<ErrorButtons />);
    
    const button = screen.getByText('Trigger Type Error');
    fireEvent.click(button);

    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Cannot read properties of null")
      })
    );
  });

  it('enables feedback button after error', () => {
    render(<ErrorButtons />);
    
    const errorButton = screen.getByText('Trigger Runtime Error');
    fireEvent.click(errorButton);

    const feedbackButton = screen.getByText('Provide Error Feedback');
    expect(feedbackButton).toBeEnabled();
  });

  it('logs error and event ID when error occurs', () => {
    render(<ErrorButtons />);
    
    const button = screen.getByText('Trigger Runtime Error');
    fireEvent.click(button);

    expect(console.log).toHaveBeenCalledWith(
      'Error captured:',
      expect.objectContaining({
        error: expect.any(Error),
        eventId: 'mock-event-id'
      })
    );
  });
});
