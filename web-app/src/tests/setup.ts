import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

(globalThis as any).jest = vi;

vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => React.createElement('a', props, children),
}));
