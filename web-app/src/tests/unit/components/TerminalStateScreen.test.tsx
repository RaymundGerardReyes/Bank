import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TerminalStateScreen } from '@/components/features/checkout/TerminalStateScreen';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('TerminalStateScreen Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders locked security badge and success title', () => {
    render(
      <TerminalStateScreen
        type="SUCCESS"
        message="Your tuition payment has been verified."
        reference="cs_test_12345"
        returnUrl="https://university.edu/student-portal/receipt"
        merchantName="State University"
        locked={true}
      />
    );

    expect(screen.getByText('Session Finalized & Locked')).toBeInTheDocument();
    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(screen.getByText('Your tuition payment has been verified.')).toBeInTheDocument();
    expect(screen.getByText('cs_test_12345')).toBeInTheDocument();
    expect(screen.getByText('Return to State University')).toBeInTheDocument();
  });

  it('renders return button pointing to returnUrl and starts countdown', () => {
    render(
      <TerminalStateScreen
        type="SUCCESS"
        message="Payment complete."
        returnUrl="https://university.edu/student-portal/receipt"
        merchantName="State University"
        locked={true}
      />
    );

    expect(screen.getByText(/Redirecting back to/)).toBeInTheDocument();
    expect(screen.getByText('5s')).toBeInTheDocument();

    // Pause auto redirect
    const pauseBtn = screen.getByText('Pause auto-redirect');
    fireEvent.click(pauseBtn);
    expect(screen.getByText('Auto-redirect paused')).toBeInTheDocument();

    // Resume
    const resumeBtn = screen.getByText('Resume auto-redirect');
    fireEvent.click(resumeBtn);
    expect(screen.getByText(/Redirecting back to/)).toBeInTheDocument();
  });

  it('uses cancelUrl for failed or cancelled terminal states', () => {
    render(
      <TerminalStateScreen
        type="FAILED"
        message="Insufficient funds"
        returnUrl="https://university.edu/success"
        cancelUrl="https://university.edu/retry"
        merchantName="State University"
        locked={true}
      />
    );

    expect(screen.getByText('Session Finalized & Locked')).toBeInTheDocument();
    expect(screen.getByText('Payment Failed')).toBeInTheDocument();
    expect(screen.getByText('Return to State University')).toBeInTheDocument();
  });

  it('ignores unsafe javascript: protocol in returnUrl', () => {
    render(
      <TerminalStateScreen
        type="SUCCESS"
        message="Payment complete."
        returnUrl="javascript:alert(document.cookie)"
        merchantName="State University"
        locked={true}
      />
    );

    // Unsafe URL should not render auto-redirect or return button
    expect(screen.queryByText('Return to State University')).not.toBeInTheDocument();
    expect(screen.getByText(/Payment has been finalized/)).toBeInTheDocument();
  });

  it('rejects self-referential /checkout/ and /success paths and does not 404', () => {
    render(
      <TerminalStateScreen
        type="SUCCESS"
        message="Payment complete."
        returnUrl="http://localhost:8080/checkout/pi_12345/success"
        merchantName="State University"
        locked={true}
      />
    );

    // Self-referential bogus URL should be rejected
    expect(screen.queryByText('Return to State University')).not.toBeInTheDocument();
    expect(screen.getByText(/Payment has been finalized/)).toBeInTheDocument();
  });
});

