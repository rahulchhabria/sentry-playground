import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackDialog } from '../FeedbackDialog';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureUserFeedback: jest.fn(),
}));

describe('FeedbackDialog', () => {
  const mockError = new Error('Test error message');
  const mockEventId = 'test-event-id';
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders dialog content when open', () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Error Feedback')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Event ID:')).toBeInTheDocument();
    expect(screen.getByText('test-event-id')).toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.queryByText('Error Feedback')).not.toBeInTheDocument();
  });

  it('submits feedback successfully', async () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('What happened?'), {
      target: { value: 'Test feedback comments' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Submit Feedback'));

    // Verify Sentry feedback was captured
    expect(Sentry.captureUserFeedback).toHaveBeenCalledWith({
      event_id: mockEventId,
      name: 'Test User',
      email: 'test@example.com',
      comments: 'Test feedback comments',
    });

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Feedback Submitted!')).toBeInTheDocument();
    });

    // Verify dialog closes after submission
    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    }, { timeout: 2000 });
  });

  it('requires all fields to be filled', () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Try to submit without filling fields
    fireEvent.click(screen.getByText('Submit Feedback'));

    // Check that form validation prevents submission
    expect(Sentry.captureUserFeedback).not.toHaveBeenCalled();
  });

  it('validates email format', () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Fill form with invalid email
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText('What happened?'), {
      target: { value: 'Test feedback' },
    });

    // Try to submit
    fireEvent.click(screen.getByText('Submit Feedback'));

    // Check that form validation prevents submission
    expect(Sentry.captureUserFeedback).not.toHaveBeenCalled();
  });

  it('logs feedback submission for debugging', () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('What happened?'), {
      target: { value: 'Test feedback comments' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Submit Feedback'));

    // Verify console.log was called with feedback data
    expect(console.log).toHaveBeenCalledWith(
      'Submitting feedback:',
      expect.objectContaining({
        eventId: mockEventId,
        name: 'Test User',
        email: 'test@example.com',
        comments: 'Test feedback comments',
      })
    );
  });

  it('resets form after submission', async () => {
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('What happened?'), {
      target: { value: 'Test feedback comments' },
    });
    fireEvent.click(screen.getByText('Submit Feedback'));

    // Wait for dialog to close
    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    }, { timeout: 2000 });

    // Reopen dialog
    render(
      <FeedbackDialog
        error={mockError}
        eventId={mockEventId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Verify form fields are reset
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('What happened?')).toHaveValue('');
  });
});
