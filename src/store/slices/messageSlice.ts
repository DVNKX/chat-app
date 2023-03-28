import {createSlice} from '@reduxjs/toolkit';

interface IMessageSlice {
  type: 'Reply' | 'Edit' | undefined;
  messageId: number;
  message: string;
  sentByName: string;
}

const initialState: IMessageSlice = {
  type: undefined,
  messageId: NaN,
  message: '',
  sentByName: '',
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    editMessage(state, action) {
      state.type = action.payload.type;
      state.messageId = action.payload.messageId;
    },
    replyMessage(state, action) {
      state.type = action.payload.type;
      state.messageId = action.payload.messageId;
      state.message = action.payload.message;
      state.sentByName = action.payload.sentByName;
    },
    annulMessage(state) {
      state.type = undefined;
      state.messageId = NaN;
      state.message = '';
      state.sentByName = '';
    },
  },
});

export default messageSlice.reducer;
