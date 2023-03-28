import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/markSlice';
import messageSlice from './slices/messageSlice';

const rootReducer = combineReducers({
  user: userReducer,
  mark: chatReducer,
  message: messageSlice,
});

export const setStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setStore>;
export type AppDispatch = AppStore['dispatch'];
