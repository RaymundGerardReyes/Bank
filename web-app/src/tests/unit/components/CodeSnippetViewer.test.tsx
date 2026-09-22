import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CodeSnippetViewer from '@/components/docs/CodeSnippetViewer';

describe('CodeSnippetViewer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, badge, code content, and notes', () => {
    render(
      <CodeSnippetViewer
        title="PaymentService.cs"
        language="C# .NET"
        badge="C# · ASP.NET"
        code="public class PaymentService {}"
        notes="Mandatory banking invariant notes."
      />
    );

    expect(screen.getByText('PaymentService.cs')).toBeInTheDocument();
    expect(screen.getByText('C# · ASP.NET')).toBeInTheDocument();
    expect(screen.getByText('public class PaymentService {}')).toBeInTheDocument();
    expect(screen.getByText('Mandatory banking invariant notes.')).toBeInTheDocument();
  });

  it('copies code to clipboard and shows feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <CodeSnippetViewer
        title="createPaymentIntent.ts"
        language="TypeScript"
        code="export async function createPaymentIntent() {}"
      />
    );

    const copyBtn = screen.getByRole('button', { name: /copy snippet to clipboard/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('export async function createPaymentIntent() {}');
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('handles clipboard failure gracefully without throwing', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <CodeSnippetViewer
        title="novabank_client.py"
        language="Python"
        code="class NovaBankClient: pass"
      />
    );

    const copyBtn = screen.getByRole('button', { name: /copy snippet to clipboard/i });
    expect(() => fireEvent.click(copyBtn)).not.toThrow();
  });
});

