/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type UiState = {
  shouldRefreshTimer: boolean;
  shouldAddSuccess: boolean;
};

/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    shouldRefreshTimer: false,
    shouldAddSuccess: false,
  } as UiState,
  reducers: {
    refreshTimer(state, action: PayloadAction<UiState['shouldRefreshTimer']>) {
      state.shouldRefreshTimer = action.payload;
    },
    refreshAdd(state, action: PayloadAction<UiState['shouldAddSuccess']>) {
      state.shouldAddSuccess = action.payload;
    },
  },
});

/**
 * Actions
 */
export const { refreshTimer, refreshAdd } = uiStateSlice.actions;

/**
 * Selectors
 */

export const selectShouldRefreshTimer = (state: ReduxState) => state.uiState.shouldRefreshTimer;
export const selectShouldAddSuccess = (state: ReduxState) => state.uiState.shouldAddSuccess;

export default uiStateSlice.reducer;
