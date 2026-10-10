import * as React from 'react';
import { useGetAccountsQuery } from '../state/api/accountApi';
import { AccountSummary } from '../models/Account';
import { useAuth } from './useAuth';

const EMPTY_ACCOUNTS: AccountSummary[] = [];

export const useAccounts = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useGetAccountsQuery(user?.email || undefined);

  const accounts = React.useMemo(() => {
    return data?.data ?? EMPTY_ACCOUNTS;
  }, [data?.data]);

  return {
    accounts,
    isLoading,
    isError,
    refetch,
  };
};
