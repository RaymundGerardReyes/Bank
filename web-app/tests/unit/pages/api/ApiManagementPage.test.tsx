import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiManagementPage from '@/app/(portals)/(dashboard)/api/page';
import { useAuth } from '@/hooks/useAuth';
import { useAccounts } from '@/hooks/useAccounts';
import { useRouter } from 'next/navigation';

// --- Mocks ---
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: vi.fn(),
}));

describe('ApiManagementPage Unit Tests', () => {
  const mockPush = vi.fn();
  let fetchMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush });
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'MERCH-505', role: 'MERCHANT' },
      isAuthenticated: true,
    });
    (useAccounts as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [{ accountNumber: '1234567890', accountType: 'CHECKING', accountName: 'Master Ledger', status: 'ACTIVE' }],
      isLoading: false,
    });

    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockImplementation(() => Promise.resolve()) },
    });

    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    fetchMock = vi.fn((url: string, options?: any) => {
      if (url.includes('/api/proxy/apikeys')) {
        if (options?.method === 'POST') {
          if (url.includes('/rotate')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({
                data: {
                  id: 1,
                  name: 'Test Key (Rotated)',
                  environment: 'SANDBOX',
                  keyPrefix: 'pk_test_',
                  maskedHash: '****999',
                  rawKey: 'sk_test_rotated_secret_123',
                  cidrWhitelist: '0.0.0.0/0',
                  scopes: ['accounts:read'],
                  expiresAt: '2027-01-01T00:00:00Z',
                  createdAt: new Date().toISOString(),
                }
              }),
            });
          }
          if (url.includes('/revoke')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ success: true }),
            });
          }
          // Create Key
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              data: {
                id: 101,
                name: 'New App Key',
                environment: 'SANDBOX',
                keyPrefix: 'pk_test_',
                maskedHash: '****123',
                rawKey: 'sk_test_secret_99999',
                cidrWhitelist: '0.0.0.0/0',
                scopes: ['treasury:read'],
                expiresAt: '2027-01-01T00:00:00Z',
                createdAt: new Date().toISOString(),
              }
            }),
          });
        }
        // GET apikeys
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: 1,
                name: 'Existing Sandbox Key',
                environment: 'SANDBOX',
                keyPrefix: 'pk_test_',
                maskedHash: '****456',
                rawKey: null,
                cidrWhitelist: '0.0.0.0/0',
                scopes: ['treasury:read'],
                expiresAt: '2027-01-01T00:00:00Z',
                createdAt: new Date().toISOString(),
              }
            ]
          }),
        });
      }

      if (url.includes('/api/proxy/webhooks')) {
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              data: {
                id: 202,
                url: 'https://partner-app.com/api/webhooks',
                environment: 'SANDBOX',
                status: 'ACTIVE',
                events: 'payment.succeeded,payment.failed',
                secretHash: 'whsec_super_secret_123',
                createdAt: new Date().toISOString(),
              }
            }),
          });
        }
        if (options?.method === 'DELETE') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }
        // GET webhooks
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: 10,
                url: 'https://partner.example.com/webhook',
                environment: 'LIVE',
                status: 'ACTIVE',
                events: 'payment.succeeded',
                secretHash: 'whsec_existing_secret',
                createdAt: new Date().toISOString(),
              }
            ]
          }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });
    });

    vi.stubGlobal('fetch', fetchMock);
  });

  // Group 1: Initialization & Rendering
  describe('Page Initialization', () => {
    it('P01: Renders page heading and header controls', async () => {
      render(<ApiManagementPage />);
      expect(screen.getByText(/Payment Orchestration Gateway/i)).toBeInTheDocument();
      expect(screen.getByText(/API Keys & Security Controls/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: /^Webhook Endpoints$/i })).toBeInTheDocument();
    });

    it('P02: Fetches and displays existing API keys', async () => {
      render(<ApiManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('Existing Sandbox Key')).toBeInTheDocument();
      });
    });

    it('P03: Fetches and displays existing Webhook endpoints', async () => {
      render(<ApiManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('https://partner.example.com/webhook')).toBeInTheDocument();
      });
    });
  });

  // Group 2: API Key Management
  describe('API Key Management', () => {
    it('P06: Opens API Key creation form when "+ Create New Key" is clicked', async () => {
      render(<ApiManagementPage />);
      const createButton = await screen.findByRole('button', { name: /\+ Create New Key/i });
      fireEvent.click(createButton);

      expect(screen.getByLabelText(/Key Name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Generate$/i })).toBeInTheDocument();
    });

    it('P07: Creates a new API key and displays raw secret key', async () => {
      render(<ApiManagementPage />);
      const createButton = await screen.findByRole('button', { name: /\+ Create New Key/i });
      fireEvent.click(createButton);

      fireEvent.change(screen.getByLabelText(/Key Name/i), { target: { value: 'New App Key' } });
      fireEvent.click(screen.getByRole('button', { name: /^Generate$/i }));

      await waitFor(() => {
        expect(screen.getByText('sk_test_secret_99999')).toBeInTheDocument();
        expect(screen.getByText(/Key Generated Successfully/i)).toBeInTheDocument();
      });
    });

    it('P08: Copies secret key to clipboard', async () => {
      render(<ApiManagementPage />);
      fireEvent.click(await screen.findByRole('button', { name: /\+ Create New Key/i }));
      fireEvent.change(screen.getByLabelText(/Key Name/i), { target: { value: 'New App Key' } });
      fireEvent.click(screen.getByRole('button', { name: /^Generate$/i }));

      const copyButton = await screen.findByRole('button', { name: /Copy Key/i });
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('sk_test_secret_99999');
    });

    it('P09: Revokes an active API key when Revoke button is clicked', async () => {
      render(<ApiManagementPage />);
      await screen.findByText('Existing Sandbox Key');

      const revokeButton = screen.getByRole('button', { name: /Revoke/i });
      fireEvent.click(revokeButton);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith('/api/proxy/apikeys/1/revoke', expect.objectContaining({ method: 'POST' }));
      });
    });
  });

  // Group 3: Webhook Management
  describe('Webhook Endpoint Management', () => {
    it('P26: Opens Webhook Endpoint creation form', async () => {
      render(<ApiManagementPage />);
      const addEndpointBtn = await screen.findByRole('button', { name: /\+ Add Endpoint/i });
      fireEvent.click(addEndpointBtn);

      expect(screen.getByLabelText(/Endpoint URL/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Endpoint/i })).toBeInTheDocument();
    });

    it('P27: Rejects non-HTTPS webhook URL', async () => {
      render(<ApiManagementPage />);
      fireEvent.click(await screen.findByRole('button', { name: /\+ Add Endpoint/i }));

      const urlInput = screen.getByLabelText(/Endpoint URL/i);
      fireEvent.change(urlInput, { target: { value: 'http://my-app.com/webhook' } });
      fireEvent.click(screen.getByRole('button', { name: /Save Endpoint/i }));

      expect(await screen.findByText(/Webhook URL must start with https:\/\//i)).toBeInTheDocument();
    });

    it('P31 & P32: Successfully registers webhook and displays signing secret', async () => {
      render(<ApiManagementPage />);
      fireEvent.click(await screen.findByRole('button', { name: /\+ Add Endpoint/i }));

      fireEvent.change(screen.getByLabelText(/Endpoint URL/i), { target: { value: 'https://partner-app.com/api/webhooks' } });
      fireEvent.click(screen.getByRole('button', { name: /Save Endpoint/i }));

      await waitFor(() => {
        expect(screen.getByText('whsec_super_secret_123')).toBeInTheDocument();
        expect(screen.getByText(/Webhook Created Successfully/i)).toBeInTheDocument();
      });
    });

    it('P35: Deletes a webhook endpoint', async () => {
      render(<ApiManagementPage />);
      await screen.findByText('https://partner.example.com/webhook');

      const deleteBtn = screen.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith('/api/proxy/webhooks/10', expect.objectContaining({ method: 'DELETE' }));
      });
    });

    it('P36: Switches between External Webhooks and Local Webhook Testing tabs', async () => {
      render(<ApiManagementPage />);
      const localTab = screen.getByRole('button', { name: /Local Webhook Testing/i });
      fireEvent.click(localTab);

      expect(await screen.findByText(/Local Webhook Simulator/i)).toBeInTheDocument();
    });
  });

  // Group 4: API Documentation Viewer
  describe('API Documentation Viewer', () => {
    it('P40: Renders the Scalar API Reference Documentation iframe', async () => {
      render(<ApiManagementPage />);
      const iframe = screen.getByTitle('Scalar API Reference Documentation');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
    });
  });
});
