import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DeveloperNavTabs from '@/components/docs/DeveloperNavTabs';

let mockPathname = '/developers';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

describe('DeveloperNavTabs Component', () => {
  beforeEach(() => {
    mockPathname = '/developers';
  });

  it('renders all three primary documentation tabs', () => {
    render(<DeveloperNavTabs />);

    expect(screen.getByRole('link', { name: /API Reference & Limits/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Codebase Snippets & Workflows/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Interactive Scalar Explorer/i })).toBeInTheDocument();
  });

  it('correctly marks /developers/snippets as active when pathname matches', () => {
    mockPathname = '/developers/snippets';
    render(<DeveloperNavTabs />);

    const snippetsTab = screen.getByRole('link', { name: /Codebase Snippets & Workflows/i });
    expect(snippetsTab.className).toContain('bg-accent');
    expect(snippetsTab.className).toContain('text-dominant');
  });

  it('renders the core security invariant badge', () => {
    render(<DeveloperNavTabs />);

    expect(
      screen.getByText(/Deterministic Pessimistic Locking & Idempotent Ledger Parity Enforced/i)
    ).toBeInTheDocument();
  });
});

