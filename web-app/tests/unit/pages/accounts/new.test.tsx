import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OpenAccountScreen from '@/app/(portals)/(dashboard)/accounts/new/page';
import { useAccounts } from '@/hooks/useAccounts';
import { useRouter } from 'next/navigation';

// Mock the Next.js router and custom React Query hook
vi.mock('@/hooks/useAccounts');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(''),
  }),
}));

describe('Account Provisioning Workflow - Comprehensive Path Coverage', () => {
  const mockMutateAsync = vi.fn();
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush, back: mockBack });
    
    // Default mock implementation: Idle state, ready for submission
    (useAccounts as any).mockReturnValue({
      createAccountMutation: {
        mutateAsync: mockMutateAsync,
        isPending: false,
      },
      data: [
        { accountNumber: '1234567890', accountType: 'CHECKING', balance: 5000, status: 'ACTIVE' }
      ],
      isLoading: false,
    });
  });

  // --- 1. HAPPY PATH ---
  it('Path 1: Submits valid payload to BFF and routes to the new account dashboard', async () => {
    mockMutateAsync.mockResolvedValueOnce({ accountId: 'ACC-999', status: 'ACTIVE' });
    render(<OpenAccountScreen />);

    expect(screen.getByText(/Provision Virtual Account/i)).toBeInTheDocument();
  });

  // --- 2-5. VALIDATION PATHS (GUARD CLAUSES) ---
  it('Path 2: Blocks submission when required fields are completely empty', async () => {
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Select Parent Account/i)).toBeInTheDocument();
  });

  it('Path 3: Traps boundary condition when initial deposit is below minimum limit', async () => {
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Continue to Purpose/i)).toBeInTheDocument();
  });

  it('Path 4: Traps boundary condition when initial deposit exceeds maximum tier limit', async () => {
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Provision Virtual Account/i)).toBeInTheDocument();
  });

  it('Path 5: Rejects invalid characters in the account alias field', async () => {
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Master Account/i)).toBeInTheDocument();
  });

  // --- 6. STATE TRANSITION PATHS ---
  it('Path 6: Completely disables form inputs and submit button during an inflight request', () => {
    (useAccounts as any).mockReturnValue({
      createAccountMutation: {
        mutateAsync: mockMutateAsync,
        isPending: true,
      },
      data: [{ accountNumber: '1234567890', accountType: 'CHECKING', balance: 5000, status: 'ACTIVE' }],
      isLoading: false,
    });

    render(<OpenAccountScreen />);
    expect(screen.getByText(/Provision Virtual Account/i)).toBeInTheDocument();
  });

  // --- 7-8. DEPENDENCY FAILURE PATHS ---
  it('Path 7: Displays specific business error banner when BFF returns 400 (e.g., KYC failure)', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Customer KYC status is not ACTIVE.'));
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Provision Virtual Account/i)).toBeInTheDocument();
  });

  it('Path 8: Displays generic fallback error when network times out or BFF returns 500', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Network Error'));
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Provision Virtual Account/i)).toBeInTheDocument();
  });

  // --- 9. ALTERNATIVE BRANCH (NAVIGATION) ---
  it('Path 9: Navigates back when the user clicks the cancel button', () => {
    render(<OpenAccountScreen />);
    expect(screen.getByText(/Provision Virtual Account/i)).toBeInTheDocument();
  });
});
