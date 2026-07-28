export const sessionService = {
  isValidSession: (token?: string): boolean => {
    return !!token && token.length > 0;
  },
  getSessionTimeoutMs: (): number => {
    return 15 * 60 * 1000; // 15 minutes
  },
};
