import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction/transactionService';
import { TransactionHistoryFilter } from '@/models/TransactionTypes';

export const useTransactions = (filter: TransactionHistoryFilter, enabled: boolean = true) => {
  const transactionHistoryQuery = useQuery({
    queryKey: ['transactionHistory', filter.accountNumber, filter.direction, filter.page],
    queryFn: () => transactionService.getAccountTransactionHistory(filter),
    enabled: enabled && !!filter.accountNumber,
  });

  return {
    transactionHistoryQuery,
    isLoadingHistory: transactionHistoryQuery.isLoading,
    historyError: transactionHistoryQuery.error,
  };
};
