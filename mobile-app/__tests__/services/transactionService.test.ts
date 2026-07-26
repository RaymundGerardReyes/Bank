import { transactionService } from '../../src/services/transaction/transactionService';

describe('transactionService', () => {
  it('should be defined', () => {
    expect(transactionService).toBeDefined();
    expect(typeof transactionService.transferInternal).toBe('function');
  });
});
