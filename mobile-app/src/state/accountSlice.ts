import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountSummary } from '../models/Account';

interface AccountState {
  accounts: AccountSummary[];
  selectedAccountNumber: string | null;
  loading: boolean;
}

const initialState: AccountState = {
  accounts: [],
  selectedAccountNumber: null,
  loading: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<AccountSummary[]>) => {
      state.accounts = action.payload;
    },
    setSelectedAccount: (state, action: PayloadAction<string>) => {
      state.selectedAccountNumber = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAccounts, setSelectedAccount, setLoading } = accountSlice.actions;
export default accountSlice.reducer;
