import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import appSlice from './reducer/app.slice';

export const reducer = combineReducers({
  app: appSlice.reducer,
});

const store = configureStore({ reducer });
export default store;

export const dispatch = store.dispatch;

export type RootDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducer>;

type DispatchFunc = () => RootDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
