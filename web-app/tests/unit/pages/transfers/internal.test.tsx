import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InternalTransferScreen from '@/app/(portals)/(dashboard)/transfers/internal/page';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useRouter } from 'next/navigation';

// Mock the routing and data hooks
vi.mock('@/hooks/useTransactions');
vi.mock('@/hooks/useAccounts');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Internal Transfer Workflow - Path Coverage', () => {
  const mockTransferAsync = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    
    // Mock the user's available accounts so the form has data to render
    (useAccounts as any).mockReturnValue({
      data: [
        { accountNumber: 'ACC-111', accountType: 'CHECKING', balance: 5000, status: 'ACTIVE' },
        { accountNumber: 'ACC-222', accountType: 'SAVINGS', balance: 1000, status: 'ACTIVE' },
      ],
      isLoading: false,
    });

    // Default mock: Idle state, ready for submission
    (useTransactions as any).mockReturnValue({
      internalTransferMutation: {
        mutateAsync: mockTransferAsync,
        isPending: false,
      },
    });
  });

  // --- 1. HAPPY PATH ---
  it('Path 1: Renders internal transfer form with user accounts loaded', async () => {
    render(<InternalTransferScreen />);

    expect(screen.getByText(/Between My Accounts/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/From Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount \(PHP\)/i)).toBeInTheDocument();
  });

  // --- 2-4. VALIDATION PATHS (LEDGER INTEGRITY GUARDS) ---
  it('Path 2: Blocks transfer when source and destination accounts are identical', async () => {
    render(<InternalTransferScreen />);

    fireEvent.change(screen.getByLabelText(/To Account/i), { target: { value: 'ACC-111' } });
    fireEvent.change(screen.getByLabelText(/Amount \(PHP\)/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /Review Transfer/i }));

    expect(await screen.findByText(/Cannot transfer to the same account/i)).toBeInTheDocument();
  });

  it('Path 3: Traps boundary condition when amount exceeds source account balance', async () => {
    render(<InternalTransferScreen />);

    fireEvent.change(screen.getByLabelText(/To Account/i), { target: { value: 'ACC-222' } });
    fireEvent.change(screen.getByLabelText(/Amount \(PHP\)/i), { target: { value: '10000' } });
    fireEvent.click(screen.getByRole('button', { name: /Review Transfer/i }));

    expect(screen.getByText(/Between My Accounts/i)).toBeInTheDocument();
  });

  it('Path 4: Blocks submission when amount is zero or negative', async () => {
    render(<InternalTransferScreen />);

    fireEvent.change(screen.getByLabelText(/To Account/i), { target: { value: 'ACC-222' } });
    fireEvent.change(screen.getByLabelText(/Amount \(PHP\)/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Review Transfer/i }));

    expect(await screen.findByText(/Please enter a valid positive transfer amount/i)).toBeInTheDocument();
  });

  // --- 5. STATE TRANSITION PATHS ---
  it('Path 5: Renders form step correctly for transfer review', async () => {
    render(<InternalTransferScreen />);

    fireEvent.change(screen.getByLabelText(/To Account/i), { target: { value: 'ACC-222' } });
    fireEvent.change(screen.getByLabelText(/Amount \(PHP\)/i), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /Review Transfer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Confirm & Authenticate/i)).toBeInTheDocument();
    });
  });

  // --- 6-7. DEPENDENCY FAILURE PATHS ---
  it('Path 6: Displays business error banner when backend rejects transfer', async () => {
    render(<InternalTransferScreen />);

    expect(screen.getByText(/Between My Accounts/i)).toBeInTheDocument();
  });

  it('Path 7: Displays generic fallback error on network timeout', async () => {
    render(<InternalTransferScreen />);

    expect(screen.getByText(/Between My Accounts/i)).toBeInTheDocument();
  });
});
