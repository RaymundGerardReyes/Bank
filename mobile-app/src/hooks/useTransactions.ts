import { useGetTransactionHistoryQuery } from '../state/api/transactionApi';

export const useTransactions = (accountNumber: string) => {
  const { data, isLoading, isError, refetch } = useGetTransactionHistoryQuery(accountNumber, {
    skip: !accountNumber,
  });

  return {
    transactions: data?.data || [],
    isLoading,
    isError,
    refetch,
  };
};
