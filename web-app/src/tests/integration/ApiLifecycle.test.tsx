import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from '@/app/(portals)/(dashboard)/api/onboard/page';
import { ApiKeyManager } from '@/components/features/api/ApiKeyManager';
import { merchantService } from '@/services/gateway/merchantService';
import { useAccounts } from '@/hooks/useAccounts';
import { vi } from 'vitest';

vi.mock('@/services/gateway/merchantService');
vi.mock('@/hooks/useAccounts');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('server-only', () => ({}));

describe('IT-10: Full API Lifecycle Journey', () => {
  it('Completes the chronological happy path from onboarding to key rotation', async () => {
    
    // 1. Onboarding Phase
    (merchantService.onboardDeveloper as any).mockResolvedValue({
      merchantId: 'M-101',
      status: 'ACTIVE',
      settlementAccountNumber: 'SETTLE-101',
      apiKey: 'sk_live_123',
      merchantCode: 'M-TEST'
    });

    const { unmount } = render(<OnboardingPage />);
    
    fireEvent.change(screen.getByLabelText(/Legal Business Name/i), { target: { value: 'Tech Startup' } });
    fireEvent.change(screen.getByLabelText(/Business Registration Number/i), { target: { value: 'BRN-123' } });
    fireEvent.change(screen.getByLabelText(/Contact Email Address/i), { target: { value: 'test@techstartup.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Initialize Merchant Workspace/i }));

    await waitFor(() => {
      expect(screen.getByText('SETTLE-101')).toBeInTheDocument();
    });
    
    unmount(); // Transition to the dashboard

    // 2. Credential Creation Phase (User selects a VAM sub-account)
    (useAccounts as any).mockReturnValue({
      data: [{ id: 'ACC-VAM-1', accountNumber: 'VAM-1001', currency: 'PHP' }],
      isLoading: false
    });
    
    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (url === '/api/proxy/apikeys' && (!options || options.method === 'GET')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
      }
      if (url === '/api/proxy/apikeys' && options?.method === 'POST') {
        const body = JSON.parse(options.body);
        // Expecting the selected VAM-1001 to be sent
        expect(body.linkedAccountId).toBe('VAM-1001');
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { id: 1, name: 'New Key', rawKey: 'sk_test_new', linkedAccountId: 'VAM-1001' }
          })
        });
      }
      return Promise.reject(new Error('Not Found'));
    });

    render(<ApiKeyManager />);
    
    // Click + Create New Key to reveal the form
    fireEvent.click(screen.getByRole('button', { name: /\+ Create New Key/i }));

    // Wait for initial render to load accounts
    await waitFor(() => {
      expect(screen.getByText(/VAM-1001/)).toBeInTheDocument();
    });

    // Fill out key creation form
    fireEvent.change(screen.getByLabelText(/Key Name/i), { target: { value: 'My VAM Key' } });
    
    // The select auto-selects VAM-1001 because it's the only one
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/proxy/apikeys', expect.objectContaining({ method: 'POST' }));
    });

    unmount();

    // 3. Rotation Phase
    // Backend rotates but preserves the VAM-1001 boundary automatically
    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (url === '/api/proxy/apikeys' && (!options || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 1, name: 'My VAM Key', linkedAccountId: 'VAM-1001', environment: 'LIVE', expiresAt: '2026-12-31' }]
          })
        });
      }
      if (url === '/api/proxy/apikeys/1/rotate' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: { id: 2, name: 'My VAM Key (Rotated)', rawKey: 'sk_live_rotated', linkedAccountId: 'VAM-1001' }
          })
        });
      }
      return Promise.reject(new Error('Not Found'));
    });

    window.confirm = vi.fn().mockReturnValue(true);

    render(<ApiKeyManager />);
    
    await waitFor(() => {
      expect(screen.getByText('My VAM Key')).toBeInTheDocument();
    });
    
    const rotateButtons = screen.getAllByRole('button', { name: /Rotate/i });
    fireEvent.click(rotateButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/proxy/apikeys/1/rotate', { method: 'POST' });
      // Notice: No selection UI was interacted with. The UI naturally mirrors the backend's authority.
    });
  });
});
