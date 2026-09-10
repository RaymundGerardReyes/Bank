import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '@/app/(portals)/(auth)/register/page';
import { useRouter } from 'next/navigation';

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('RegisterPage - Multi-Step KYC & Responsive Layout', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    // Mock window.fetch
    global.fetch = vi.fn();
  });

  it('renders Step 1 with canonical logo, responsive name grid, and validation', async () => {
    render(<RegisterPage />);

    // Brand Logo & Card Branding
    expect(screen.getAllByText('MunBank').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('heading', { name: /start your journey/i, level: 2 })).toBeInTheDocument();

    // Inputs
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/secure password/i)).toBeInTheDocument();

    // 3D Card Showcase
    expect(screen.getByText(/your digital premium card/i)).toBeInTheDocument();

    // Mobile trust badge
    expect(screen.getByText(/256-bit ssl encrypted • fdic insured partner banking/i)).toBeInTheDocument();

    // Complete Step 1
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Morgan' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@enterprise.com' } });
    fireEvent.change(screen.getByLabelText(/secure password/i), { target: { value: 'SecurePass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));

    // Should transition to Step 2: Financial Profile
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /financial profile/i, level: 2 })).toBeInTheDocument();
      expect(screen.getByLabelText(/employment status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/current job title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estimated monthly income/i)).toBeInTheDocument();
    });
  });

  it('submits Step 2 successfully and routes to /otp', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Account created' }),
    });

    render(<RegisterPage />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jordan' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Lee' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jordan@corp.com' } });
    fireEvent.change(screen.getByLabelText(/secure password/i), { target: { value: 'Secret12345!' } });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/current job title/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/current job title/i), { target: { value: 'VP Engineering' } });
    fireEvent.change(screen.getByLabelText(/estimated monthly income/i), { target: { value: '10000+' } });

    fireEvent.click(screen.getByRole('button', { name: /complete account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/proxy/auth/register', expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith('/otp');
    });
  });
});
