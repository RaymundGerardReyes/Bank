import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApiKeyManager } from '@/components/features/api/ApiKeyManager';
import { useAccounts } from '@/hooks/useAccounts';
import { apiClient } from '@/services/api/apiClient';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/hooks/useAccounts');
vi.mock('@/services/api/apiClient');

describe('ApiKeyManager Component', () => {
  const mockAccounts = [
    { id: 'ACC-A', accountNumber: 'VAM-1001', balance: 500 },
    { id: 'ACC-B', accountNumber: 'VAM-2002', balance: 0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAccounts as any).mockReturnValue({ data: mockAccounts, isLoading: false });
    // Mock global fetch for ApiKeyManager since it uses native fetch for /api/proxy/apikeys
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] })
    });
  });

  it('UT-01 & UT-02: Renders account-scope selector with eligible VAM accounts', async () => {
    render(<ApiKeyManager />);
    
    // Wait for initial fetch and click the create button to reveal the form
    await waitFor(() => expect(screen.getByRole('button', { name: /\+ Create New Key/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /\+ Create New Key/i }));
    await waitFor(() => {
      expect(screen.getByText(/Account Scope/i)).toBeInTheDocument();
      expect(screen.getByText(/VAM-1001/)).toBeInTheDocument();
      expect(screen.getByText(/VAM-2002/)).toBeInTheDocument();
      expect(screen.queryByText('Unrestricted')).not.toBeInTheDocument();
    });
  });

  it('UT-08 & PT-16: Rotation does not request or submit an account selection', async () => {
    // Override fetch to return an existing key
    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (url === '/api/proxy/apikeys' && (!options || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 123, name: 'Test Key', linkedAccountId: 'VAM-1001', environment: 'LIVE', expiresAt: '2026-12-31' }]
          })
        });
      }
      if (url === '/api/proxy/apikeys/123/rotate' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { id: 456, name: 'Test Key (Rotated)', rawKey: 'sk_live_rotated', linkedAccountId: 'VAM-1001' }
          })
        });
      }
      return Promise.reject(new Error('Not Found'));
    });
    
    // Stub window.confirm
    window.confirm = vi.fn().mockReturnValue(true);

    render(<ApiKeyManager />);
    
    // Wait for keys to load
    await waitFor(() => {
      expect(screen.getByText('Test Key')).toBeInTheDocument();
    });

    const rotateBtn = screen.getByRole('button', { name: /Rotate/i });
    fireEvent.click(rotateBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/proxy/apikeys/123/rotate', { method: 'POST' });
      // Notice: No body is passed. The backend determines the boundary.
    });
  });

  it('PT-01: Switching between Sandbox and Live updates environment constraints and policy labels', async () => {
    render(<ApiKeyManager />);
    
    await waitFor(() => expect(screen.getByRole('button', { name: /\+ Create New Key/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /\+ Create New Key/i }));

    // By default Sandbox is selected
    expect(screen.getByText(/Sandbox Environment/i)).toBeInTheDocument();
    expect(screen.getByText(/365-Day Rotation/i)).toBeInTheDocument();

    // Switch to Live Production
    const liveButton = screen.getByRole('button', { name: /Live Production/i });
    fireEvent.click(liveButton);

    await waitFor(() => {
      expect(screen.getByText(/Commercial Profile \(Required for Live\)/i)).toBeInTheDocument();
      expect(screen.getByText(/90-Day Rotation/i)).toBeInTheDocument();
    });
  });

  it('PT-02: Verified merchant displays green verification badge and pre-fills verified profile', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/proxy/apikeys/merchant-status') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: {
              hasMerchantProfile: true,
              verified: true,
              eligibleForLive: true,
              legalName: 'Acme Verified Corp',
              merchantCode: 'M-ACME-VERIFIED',
              businessRegistrationNumber: '000-123-456-000',
              settlementAccountNumber: 'VAM-1001',
              status: 'ACTIVE'
            }
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      });
    });

    render(<ApiKeyManager />);

    await waitFor(() => {
      expect(screen.getByText(/Verified Merchant: Acme Verified Corp/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /\+ Create New Key/i }));

    // Switch to Live
    const liveButton = screen.getByRole('button', { name: /Live Production/i });
    fireEvent.click(liveButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Verified Merchant/i).length).toBeGreaterThan(0);
      expect(screen.getByDisplayValue('Acme Verified Corp')).toBeInTheDocument();
      expect(screen.getByDisplayValue('000-123-456-000')).toBeInTheDocument();
    });
  });
});
