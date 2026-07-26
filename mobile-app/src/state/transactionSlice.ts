import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../models/Transaction';

interface TransactionState {
  transactions: Transaction[];
  draftIdempotencyKey: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  draftIdempotencyKey: null,
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setDraftIdempotencyKey: (state, action: PayloadAction<string | null>) => {
      state.draftIdempotencyKey = action.payload;
    },
  },
});

export const { setTransactions, setDraftIdempotencyKey } = transactionSlice.actions;
export default transactionSlice.reducer;
