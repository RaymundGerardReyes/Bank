import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OtpPage from '@/app/(portals)/(auth)/otp/page';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('OtpPage - Single-Flight Deduplication & Cooldown Defense', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useRouter as any).mockReturnValue({ push: mockPush });
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/proxy/auth/otp/send')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'A 6-digit verification code has been sent to your email.' }),
        });
      }
      if (url.includes('/api/proxy/auth/otp/verify')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'OTP verified successfully' }),
        });
      }
      return Promise.reject(new Error('Unknown URL: ' + url));
    });
  });

  it('renders brand logo and only dispatches ONE OTP request on mount', async () => {
    sessionStorage.setItem('registration_email', 'security@company.com');

    const { rerender } = render(<OtpPage />);

    // Rerender simulates React StrictMode double mount
    rerender(<OtpPage />);

    expect(screen.getByText('MunBank')).toBeInTheDocument();
    expect(screen.getByText('Security Verification')).toBeInTheDocument();
    expect(screen.getByText('security@company.com')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/proxy/auth/otp/send', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'security@company.com' }),
    }));
  });

  it('enters cooldown after sending and blocks rapid resend attempts', async () => {
    sessionStorage.setItem('registration_email', 'security@company.com');

    render(<OtpPage />);

    await waitFor(() => {
      expect(screen.getByText(/resend code in/i)).toBeInTheDocument();
    });

    const resendBtn = screen.getByRole('button', { name: /resend code in/i });
    expect(resendBtn).toBeDisabled();

    // Clicking while in cooldown should NOT make another fetch call
    fireEvent.click(resendBtn);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('submits code and redirects to /accounts on valid OTP', async () => {
    sessionStorage.setItem('registration_email', 'security@company.com');

    render(<OtpPage />);

    const input = screen.getByLabelText(/6-digit otp code/i);
    fireEvent.change(input, { target: { value: '123456' } });

    const submitBtn = screen.getByRole('button', { name: /verify code/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/proxy/auth/otp/verify', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'security@company.com', code: '123456' }),
      }));
      expect(mockPush).toHaveBeenCalledWith('/accounts');
    });
  });
});

