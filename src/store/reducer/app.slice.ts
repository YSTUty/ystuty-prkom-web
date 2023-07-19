import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store2 from 'store2';

export interface IAppState {
  userUid: string;
}
const urlParams = new URLSearchParams(window.location.search);
const userUid = urlParams.get('userUid');

const initialState: IAppState = {
  userUid: userUid || store2.get('app.userUid') || '',
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
  },
});

export default appSlice;
