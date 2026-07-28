import { useGetAccountsQuery } from 'src/state/api/accountApi';

export const useAccounts = () => {
  const { data, isLoading, isError, refetch } = useGetAccountsQuery();

  return {
    accounts: data?.data || [],
    isLoading,
    isError,
    refetch,
  };
};
