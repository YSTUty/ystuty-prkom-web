import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store2 from 'store2';
import ym from '@appigram/react-yandex-metrika';

// type InfoMessageType = 'mainPage' | 'userView';
type InfoMessageType = {
  mainPage: boolean;
  userView: boolean;
};

export interface IAppState {
  userUid: string;
  // showInfoMessage: Record<InfoMessageType, boolean>;
  showInfoMessage: InfoMessageType;
  showPositions: boolean;
}
const urlParams = new URLSearchParams(window.location.search);
const userUid = urlParams.get('userUid');

function prepareshowInfoMessage(rec: Partial<InfoMessageType>): InfoMessageType {
  console.log('rec', rec);

  return {
    mainPage: rec?.mainPage ?? true,
    userView: rec?.userView ?? true,
  };
}

const initialState: IAppState = {
  userUid: userUid || store2.get('app.userUid') || '',
  showInfoMessage: prepareshowInfoMessage(store2.get('app.showInfoMessage')),
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
    toggleInfoMessage: (state, action: PayloadAction<{ type: keyof InfoMessageType; power?: boolean }>) => {
      state.showInfoMessage[action.payload.type] = action.payload.power ?? !state.showInfoMessage[action.payload.type];
      if (!state.showInfoMessage.userView) {
        try {
          ym('reachGoal', 'page.user.infoMessage-close');
        } catch {}
      }
      store2.set('app.showInfoMessage', state.showInfoMessage);
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
