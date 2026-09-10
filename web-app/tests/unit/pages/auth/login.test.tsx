import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '@/app/(portals)/(auth)/login/page';
import { authService } from '@/services/auth/authService';
import { useRouter } from 'next/navigation';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock authService
vi.mock('@/services/auth/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('LoginPage - Responsive Layout & Authentication Flows', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  it('renders the brand logo, responsive headings, and all form controls', () => {
    render(<LoginPage />);

    // Brand Logo
    expect(screen.getByText('MunBank')).toBeInTheDocument();

    // Headings & instructions
    expect(screen.getByRole('heading', { name: /welcome back/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/enter your credentials to access your secure enterprise/i)).toBeInTheDocument();

    // Inputs
    expect(screen.getByLabelText(/work email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/secure password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to dashboard/i })).toBeInTheDocument();

    // Links
    expect(screen.getByRole('link', { name: /forgot password\?/i })).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByRole('link', { name: /request access/i })).toHaveAttribute('href', '/register');

    // Desktop Security Panel & Mobile Trust Badge
    expect(screen.getByText(/zero-trust architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/256-bit ssl encrypted • zero-trust banking/i)).toBeInTheDocument();
  });

  it('submits valid credentials and redirects to /accounts on success', async () => {
    (authService.login as any).mockResolvedValueOnce({
      success: true,
      data: { id: 'usr-1', email: 'director@enterprise.com', role: 'ROLE_USER' },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/work email address/i), {
      target: { value: 'director@enterprise.com' },
    });
    fireEvent.change(screen.getByLabelText(/secure password/i), {
      target: { value: 'SuperSecret123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in to dashboard/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('director@enterprise.com', 'SuperSecret123!');
      expect(mockPush).toHaveBeenCalledWith('/accounts');
    });
  });

  it('displays an error banner when authentication fails', async () => {
    (authService.login as any).mockRejectedValueOnce(
      new Error('Invalid email or password. Please try again.')
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/work email address/i), {
      target: { value: 'unknown@enterprise.com' },
    });
    fireEvent.change(screen.getByLabelText(/secure password/i), {
      target: { value: 'WrongPass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in to dashboard/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

