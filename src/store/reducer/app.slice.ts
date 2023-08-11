import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store2 from 'store2';
import ym from '@appigram/react-yandex-metrika';

export interface IAppState {
  userUid: string;
  showUserInfoMessage: boolean;
  showPositions: boolean;
}
const urlParams = new URLSearchParams(window.location.search);
const userUid = urlParams.get('userUid');

const initialState: IAppState = {
  userUid: userUid || store2.get('app.userUid') || '',
  showUserInfoMessage: store2.get('app.showUserInfoMessage') ?? true,
  showPositions: store2.get('app.showPositions') ?? false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserUid: (state, action: PayloadAction<string>) => {
      const val = action.payload;
      state.userUid = val;
      store2.set('app.userUid', val);
    },
    toggleUserInfoMessage: (state, action: PayloadAction<boolean | undefined>) => {
      state.showUserInfoMessage = action.payload ?? !state.showUserInfoMessage;
      if (!state.showUserInfoMessage) {
        try {
          ym('reachGoal', 'page.user.infoMessage-close');
        } catch {}
      }
      store2.set('app.showUserInfoMessage', state.showUserInfoMessage);
    },
    toggleShowPositions: (state, action: PayloadAction<boolean | undefined>) => {
      state.showPositions = action.payload ?? !state.showPositions;
      if (!state.showPositions) {
        try {
          ym('reachGoal', 'page.user.showPositions');
        } catch {}
      }
      store2.set('app.showPositions', state.showPositions);
    },
  },
});

export default appSlice;
