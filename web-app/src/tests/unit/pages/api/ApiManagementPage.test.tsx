import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from '@/app/(portals)/(dashboard)/api/onboard/page';
import { merchantService } from '@/services/gateway/merchantService';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('@/server/config/env', () => ({
  env: {
    SESSION_SECRET: 'mock-secret',
    INTERNAL_BFF_API_KEY: 'mock-key',
    BACKEND_API_BASE_URL: 'http://localhost:8080'
  }
}));

vi.mock('@/services/gateway/merchantService');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('server-only', () => ({}));

describe('Developer Onboarding Page', () => {
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it('UT-10 & PT-01: Submits business profile and displays system-provisioned settlement account', async () => {
    // The backend provisions the settlement account automatically. 
    // The frontend must NOT send a linkedAccountId during onboarding.
    (merchantService.onboardDeveloper as any).mockResolvedValue({
      merchantId: 'M-777',
      status: 'ACTIVE',
      settlementAccountNumber: 'SETTLE-999', // System-provisioned by backend
      apiKey: 'sk_live_1234',
      merchantCode: 'M-ACME'
    });

    render(<OnboardingPage />);
    
    // Fill out business info
    fireEvent.change(screen.getByLabelText(/Legal Business Name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Business Registration Number/i), { target: { value: 'BRN-123' } });
    fireEvent.change(screen.getByLabelText(/Contact Email Address/i), { target: { value: 'test@acme.com' } });
    
    // There should be no "Select Bank Account" dropdown on this page
    expect(screen.queryByLabelText(/Bank Account/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Initialize Merchant Workspace/i }));

    await waitFor(() => {
      expect(merchantService.onboardDeveloper).toHaveBeenCalled();
      // UT-09: Verifies the UI labels it correctly
      expect(screen.getByText(/System-Provisioned Settlement Account No\./i)).toBeInTheDocument();
      expect(screen.getByText('SETTLE-999')).toBeInTheDocument();
    });
  });

  it('PT-02: Displays errors without altering merchant-ready UI state', async () => {
    (merchantService.onboardDeveloper as any).mockRejectedValue(new Error("Onboarding failed due to compliance block"));

    render(<OnboardingPage />);
    
    fireEvent.change(screen.getByLabelText(/Legal Business Name/i), { target: { value: 'Shady Business' } });
    fireEvent.change(screen.getByLabelText(/Business Registration Number/i), { target: { value: 'BRN-123' } });
    fireEvent.change(screen.getByLabelText(/Contact Email Address/i), { target: { value: 'test@shady.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Initialize Merchant Workspace/i }));

    await waitFor(() => {
      expect(screen.getByText('Onboarding Provisioning Error')).toBeInTheDocument();
      expect(screen.queryByText(/Merchant Provisioned Successfully!/i)).not.toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
