import { handleActions } from 'redux-actions';
import { updateCat, updateRemindDate, updateNoticeCloseTime } from '../actions/uiState';

type UiState = {
  shouldRefreshCat: boolean;
  remindDate: string | null;
  noticeCloseTime: string | null;
};

// Reducers
const uiState = handleActions<any>(
  {
    [updateCat.toString()]: (state, action) => {
      return {
        ...state,
        shouldRefreshCat: action.payload,
      };
    },
    [updateRemindDate.toString()]: (state, action) => {
      return {
        ...state,
        remindDate: action.payload,
      };
    },
    [updateNoticeCloseTime.toString()]: (state, action) => {
      return {
        ...state,
        noticeCloseTime: action.payload,
      };
    },
  },
  {
    shouldRefreshCat: false,
    remindDate: null,
  } as UiState
);

export const selectShouldRefreshCat = state => state.uiState.shouldRefreshCat;
export const selectRemindDate = state => state.uiState.remindDate;
export const selectNoticeCloseTime = state => state.uiState.noticeCloseTime;

export const reducers = {
  uiState,
};
