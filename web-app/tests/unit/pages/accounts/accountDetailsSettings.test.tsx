import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccountDetailsPage from '@/app/(portals)/(dashboard)/accounts/[accountId]/page';
import { accountService } from '@/services/account/accountService';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useParams: () => ({ accountId: 'ACC-123' }),
}));

vi.mock('@/services/account/accountService');

describe('Account Controller Settings - UI Integration Paths', () => {
  const mockAccount = {
    id: 1,
    accountNumber: 'ACC-123',
    accountName: 'Primary Treasury Account',
    status: 'ACTIVE',
    balance: 50000.00,
    currency: 'PHP',
    frozen: false,
    allowIncoming: true,
    allowOutgoing: true,
    requireDualApproval: false,
    createdAt: '2026-08-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(<AccountDetailsPage />);

  it('P01: Renders loading state while resolving account details', () => {
    vi.mocked(accountService.getAccountById).mockImplementation(() => new Promise(() => {})); // Never resolves
    renderComponent();
    expect(screen.getByText(/Loading account details/i)).toBeInTheDocument();
  });

  it('P02: Accurately renders initial database states on toggles', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Governance & Controller Settings/i)).toBeInTheDocument();
    });
    
    const frozenToggle = screen.getByRole('button', { name: /Toggle Account Freeze State/i });
    expect(frozenToggle).toHaveClass('bg-slate-700'); // false (inactive)
  });

  it('P03: Clicking a toggle dispatches the correct PATCH payload', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    vi.mocked(accountService.updateAccountSettings).mockResolvedValue({ success: true, message: 'OK', data: { ...mockAccount, frozen: true }, timestamp: '' });
    
    renderComponent();
    const frozenToggle = await screen.findByRole('button', { name: /Toggle Account Freeze State/i });
    
    await act(async () => {
      fireEvent.click(frozenToggle);
    });
    
    expect(accountService.updateAccountSettings).toHaveBeenCalledWith('ACC-123', { frozen: true });
  });

  it('P04: Temporarily disables the toggle while mutation is inflight', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    
    let resolveMutation: any;
    const mutationPromise = new Promise((resolve) => { resolveMutation = resolve; });
    vi.mocked(accountService.updateAccountSettings).mockImplementation(() => mutationPromise as any);
    
    renderComponent();
    const incomingToggle = await screen.findByRole('button', { name: /Toggle Allow Incoming Transfers/i });
    
    await act(async () => {
      fireEvent.click(incomingToggle);
    });
    
    expect(incomingToggle).toBeDisabled();
    
    await act(async () => {
      resolveMutation({ success: true, message: 'OK', data: { ...mockAccount, allowIncoming: false }, timestamp: '' });
    });
  });

  it('P05: Isolates state so toggling one does not impact others visually', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    vi.mocked(accountService.updateAccountSettings).mockResolvedValue({ success: true, message: 'OK', data: { ...mockAccount, allowOutgoing: false }, timestamp: '' });
    
    renderComponent();
    const outgoingToggle = await screen.findByRole('button', { name: /Toggle Allow Outgoing Transfers/i });
    
    await act(async () => {
      fireEvent.click(outgoingToggle);
    });
    
    expect(accountService.updateAccountSettings).toHaveBeenCalledWith('ACC-123', { allowOutgoing: false });
    expect(accountService.updateAccountSettings).not.toHaveBeenCalledWith('ACC-123', expect.objectContaining({ allowIncoming: expect.anything() }));
  });

  it('P06: Optimistically updates state on success', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    vi.mocked(accountService.updateAccountSettings).mockResolvedValue({ success: true, message: 'OK', data: { ...mockAccount, requireDualApproval: true }, timestamp: '' });
    
    renderComponent();
    const dualToggle = await screen.findByRole('button', { name: /Toggle Require Dual Approval/i });
    
    await act(async () => {
      fireEvent.click(dualToggle);
    });
    
    await waitFor(() => {
      expect(dualToggle).toHaveClass('bg-indigo-600');
    });
  });

  it('P07: Rolls back visual state if API returns error', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    vi.mocked(accountService.updateAccountSettings).mockRejectedValue(new Error('Internal Server Error'));
    
    renderComponent();
    const frozenToggle = await screen.findByRole('button', { name: /Toggle Account Freeze State/i });
    
    expect(frozenToggle).toHaveClass('bg-slate-700');
    
    await act(async () => {
      fireEvent.click(frozenToggle);
    });
    
    await waitFor(() => {
      expect(frozenToggle).toHaveClass('bg-slate-700');
      expect(frozenToggle).not.toBeDisabled();
    });
  });

  it('P08: Displays an authorization error banner when API fails', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    vi.mocked(accountService.updateAccountSettings).mockRejectedValue(new Error('You do not have permission to modify this account settings'));
    
    renderComponent();
    const frozenToggle = await screen.findByRole('button', { name: /Toggle Account Freeze State/i });
    
    await act(async () => {
      fireEvent.click(frozenToggle);
    });
    
    expect(await screen.findByText(/You do not have permission/i)).toBeInTheDocument();
  });

  it('P09: Displays fallback message on gateway failure', async () => {
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: mockAccount, timestamp: '' });
    vi.mocked(accountService.updateAccountSettings).mockRejectedValue(new Error('Gateway Timeout'));
    
    renderComponent();
    const frozenToggle = await screen.findByRole('button', { name: /Toggle Account Freeze State/i });
    
    await act(async () => {
      fireEvent.click(frozenToggle);
    });
    
    expect(await screen.findByText(/Gateway Timeout/i)).toBeInTheDocument();
  });

  it('P10: Correctly displays Frozen badge when total lockdown is active', async () => {
    const frozenAccount = { ...mockAccount, frozen: true };
    vi.mocked(accountService.getAccountById).mockResolvedValue({ success: true, message: 'OK', data: frozenAccount, timestamp: '' });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('FROZEN')).toBeInTheDocument();
    });
  });
});
