import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CodebaseSnippetsPage from '@/app/(public)/developers/snippets/page';

vi.mock('next/navigation', () => ({
  usePathname: () => '/developers/snippets',
}));

describe('CodebaseSnippetsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial page state with 5 language options and 7 workflows', () => {
    render(<CodebaseSnippetsPage />);

    // Header
    expect(screen.getByRole('heading', { level: 1, name: /Codebase Snippets & Workflows/i })).toBeInTheDocument();

    // 5 Languages
    expect(screen.getByRole('button', { name: /C# \.NET/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Java/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Python/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TypeScript/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cURL/i })).toBeInTheDocument();

    // 7 Workflows (appear in selector buttons)
    expect(screen.getByRole('button', { name: /1\. Auth & Tracing Setup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2\. Checkout & QR Ph Session/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3\. Direct Payment Intent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /4\. Internal VAM Transfer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /5\. Query Status & Refund/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /6\. Secure Webhook Server/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /7\. Webhook Simulator & Testing/i })).toBeInTheDocument();
  });

  it('dynamically injects custom credentials into the active code snippet', () => {
    render(<CodebaseSnippetsPage />);

    // Find API Key input
    const apiKeyInput = screen.getByPlaceholderText('sk_test_...');
    fireEvent.change(apiKeyInput, { target: { value: 'sk_live_custom_merchant_key_777' } });

    // The code block should immediately reflect the custom key
    expect(screen.getByText(/sk_live_custom_merchant_key_777/)).toBeInTheDocument();
  });

  it('switches programming language when clicking language tabs', () => {
    render(<CodebaseSnippetsPage />);

    // Click Python
    const pythonBtn = screen.getByRole('button', { name: /Python/i });
    fireEvent.click(pythonBtn);

    expect(screen.getByText('create_checkout.py')).toBeInTheDocument();
    expect(screen.getByText(/import httpx/)).toBeInTheDocument();

    // Click TypeScript
    const tsBtn = screen.getByRole('button', { name: /TypeScript/i });
    fireEvent.click(tsBtn);

    expect(screen.getByText('createCheckoutSession.ts')).toBeInTheDocument();
    expect(screen.getByText(/createCheckoutSession\(params: CheckoutParams\)/)).toBeInTheDocument();
  });

  it('switches workflows and reveals workflow-specific explanations', () => {
    render(<CodebaseSnippetsPage />);

    // Switch to Internal VAM Transfer
    const vamWorkflowBtn = screen.getByRole('button', { name: /4\. Internal VAM Transfer/i });
    fireEvent.click(vamWorkflowBtn);

    expect(screen.getByText(/Virtual Account Management \(VAM\) Boundaries/i)).toBeInTheDocument();
    expect(screen.getByText(/VAM_BOUNDARY_VIOLATION/i)).toBeInTheDocument();

    // Switch to Webhook Server
    const webhookWorkflowBtn = screen.getByRole('button', { name: /6\. Secure Webhook Server/i });
    fireEvent.click(webhookWorkflowBtn);

    expect(screen.getByText(/Webhook Security & Verification Architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Timing Attack Defense/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Raw Bytes Invariant/i)).toBeInTheDocument();
  });

  it('resets credentials back to sandbox defaults when clicking reset button', () => {
    render(<CodebaseSnippetsPage />);

    const apiKeyInput = screen.getByPlaceholderText('sk_test_...') as HTMLInputElement;
    fireEvent.change(apiKeyInput, { target: { value: 'sk_custom_override_val' } });
    expect(apiKeyInput.value).toBe('sk_custom_override_val');

    const resetBtn = screen.getByRole('button', { name: /Reset to Sandbox Defaults/i });
    fireEvent.click(resetBtn);

    expect(apiKeyInput.value).toBe('sk_test_novabank_99214b');
  });

  it('renders the multi-stack cryptographic verification proof with all 5 runtimes', () => {
    render(<CodebaseSnippetsPage />);

    expect(screen.getByText(/Cryptographic Parity & Multi-Stack Execution Proof/i)).toBeInTheDocument();
    expect(screen.getByText(/Deterministic Cross-Language Test Vector/i)).toBeInTheDocument();
    expect(screen.getByText(/22901869ea2be45db87b6516f82e0bf2ccb57e80ca91649e1439521391b31cbe/i)).toBeInTheDocument();
    expect(screen.getByText(/C# \.NET 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Java 21 LTS/i)).toBeInTheDocument();
    expect(screen.getByText(/Python 3\.13/i)).toBeInTheDocument();
    expect(screen.getByText(/Node\.js 22/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenSSL 3\.5/i)).toBeInTheDocument();
  });
});
