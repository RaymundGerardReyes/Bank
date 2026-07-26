import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  globalLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

const initialState: UiState = {
  globalLoading: false,
  errorMessage: null,
  successMessage: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
  },
});

export const { setGlobalLoading, setError, setSuccess } = uiSlice.actions;
export default uiSlice.reducer;
