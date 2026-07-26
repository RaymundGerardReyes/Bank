import { authService } from '../../src/services/auth/authService';

describe('authService', () => {
  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(typeof authService.login).toBe('function');
  });
});
