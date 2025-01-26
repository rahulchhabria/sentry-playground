import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { PerformanceTests } from '../PerformanceTests';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  startTransaction: jest.fn(),
  configureScope: jest.fn(),
}));

describe('PerformanceTests', () => {
  const mockSpan = {
    finish: jest.fn(),
    setStatus: jest.fn(),
  };

  const mockTransaction = {
    startChild: jest.fn(() => mockSpan),
    finish: jest.fn(),
    setStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Sentry.startTransaction as jest.Mock).mockReturnValue(mockTransaction);
  });

  it('renders all performance test buttons', () => {
    render(<PerformanceTests />);
    
    expect(screen.getByText('Trigger Slow Operation')).toBeInTheDocument();
    expect(screen.getByText('Trigger Slow API Call')).toBeInTheDocument();
    expect(screen.getByText('Trigger Nested Operations')).toBeInTheDocument();
  });

  it('simulates slow operation with transaction tracking', async () => {
    render(<PerformanceTests />);
    
    const button = screen.getByText('Trigger Slow Operation');
    await act(async () => {
      fireEvent.click(button);
    });

    // Check loading state
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Verify transaction was started
    expect(Sentry.startTransaction).toHaveBeenCalledWith({
      name: 'Slow Operation',
      op: 'slow-operation'
    });

    // Verify scope was configured
    expect(Sentry.configureScope).toHaveBeenCalled();

    // Verify child span was created
    expect(mockTransaction.startChild).toHaveBeenCalledWith({
      op: 'task',
      description: 'Expensive calculation',
    });

    // Wait for operation to complete
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    }, { timeout: 3000 });

    // Verify spans were finished
    expect(mockSpan.finish).toHaveBeenCalled();
    expect(mockTransaction.finish).toHaveBeenCalled();
  });

  it('simulates slow API call with error handling', async () => {
    render(<PerformanceTests />);
    
    const button = screen.getByText('Trigger Slow API Call');
    await act(async () => {
      fireEvent.click(button);
    });

    // Check loading state
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Verify transaction was started
    expect(Sentry.startTransaction).toHaveBeenCalledWith({
      name: 'Slow API Call',
      op: 'http'
    });

    // Verify child span was created with correct properties
    expect(mockTransaction.startChild).toHaveBeenCalledWith({
      op: 'http.client',
      description: 'GET /api/slow',
    });

    // Wait for operation to complete
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    }, { timeout: 4000 });

    // Verify span status was set and spans were finished
    expect(mockSpan.setStatus).toHaveBeenCalledWith('ok');
    expect(mockSpan.finish).toHaveBeenCalled();
    expect(mockTransaction.finish).toHaveBeenCalled();
  });

  it('simulates nested operations with multiple spans', async () => {
    render(<PerformanceTests />);
    
    const button = screen.getByText('Trigger Nested Operations');
    await act(async () => {
      fireEvent.click(button);
    });

    // Check loading state
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Verify transaction was started
    expect(Sentry.startTransaction).toHaveBeenCalledWith({
      name: 'Nested Operations',
      op: 'nested'
    });

    // Wait for all operations to complete
    await waitFor(() => {
      // Verify all child spans were created with correct properties
      expect(mockTransaction.startChild).toHaveBeenCalledWith({
        op: 'db.query',
        description: 'SELECT * FROM large_table',
      });

      expect(mockTransaction.startChild).toHaveBeenCalledWith({
        op: 'task.process',
        description: 'Process data',
      });

      expect(mockTransaction.startChild).toHaveBeenCalledWith({
        op: 'cache.set',
        description: 'Update cache',
      });

      expect(button).not.toBeDisabled();
    }, { timeout: 4000 });

    // Verify all spans were finished
    expect(mockSpan.finish).toHaveBeenCalledTimes(3);
    expect(mockTransaction.finish).toHaveBeenCalled();
  });

  it('disables all buttons while any operation is running', async () => {
    render(<PerformanceTests />);
    
    const slowOpButton = screen.getByText('Trigger Slow Operation');
    const slowApiButton = screen.getByText('Trigger Slow API Call');
    const nestedButton = screen.getByText('Trigger Nested Operations');

    await act(async () => {
      fireEvent.click(slowOpButton);
    });

    // Verify all buttons are disabled
    await waitFor(() => {
      expect(slowOpButton).toBeDisabled();
      expect(slowApiButton).toBeDisabled();
      expect(nestedButton).toBeDisabled();
    });

    // Wait for operation to complete
    await waitFor(() => {
      expect(slowOpButton).not.toBeDisabled();
      expect(slowApiButton).not.toBeDisabled();
      expect(nestedButton).not.toBeDisabled();
    }, { timeout: 3000 });
  });

  it('shows loading spinner only on the active operation button', async () => {
    render(<PerformanceTests />);
    
    const slowOpButton = screen.getByText('Trigger Slow Operation');
    await act(async () => {
      fireEvent.click(slowOpButton);
    });

    // Verify loading spinner is only shown on the clicked button
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner-api')).not.toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner-nested')).not.toBeInTheDocument();
    });

    // Wait for operation to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
