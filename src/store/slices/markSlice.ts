import {createSlice} from '@reduxjs/toolkit';
import {DocumentData} from 'firebase/firestore';

export type ChatType = {
  id: string;
  membersCount: number;
};

interface IChatSlice {
  uids: string[];
  names: string[];
  chats: ChatType[];
  contacts: DocumentData[];
}

const initialState: IChatSlice = {
  uids: [],
  names: [],
  chats: [],
  contacts: [],
};

export const markSlice = createSlice({
  name: 'mark',
  initialState,
  reducers: {
    addMemberUid(state, action) {
      if (state.uids.includes(action.payload)) {
        state.uids;
      } else {
        state.uids.push(action.payload);
      }
    },
    deleteMemberUid(state, action) {
      state.uids = state.uids.filter(uid => uid !== action.payload);
    },
    addMemberName(state, action) {
      if (state.names.includes(action.payload + ' ')) {
        state.names;
      } else {
        state.names.push(action.payload + ' ');
      }
    },
    deleteMemberName(state, action) {
      state.names = state.names.filter(uid => uid !== action.payload + ' ');
    },
    addContact(state, action) {
      if (Boolean(state.contacts.find(c => c.id === action.payload.id))) {
        state.contacts;
      } else {
        state.contacts.push(action.payload);
      }
    },
    deleteContact(state, action) {
      state.contacts = state.contacts.filter(c => c.id !== action.payload.id);
    },
    annulMembers(state) {
      state.uids = [];
      state.names = [];
    },
    annulContactsList(state) {
      state.contacts = [];
    },
    addChats(state, action) {
      if (Boolean(state.chats.find(c => c.id === action.payload.id))) {
        state.chats;
      } else {
        state.chats.push(action.payload);
      }
    },
    deleteChats(state, action) {
      state.chats = state.chats.filter(c => c.id !== action.payload.id);
    },
    annulChats(state) {
      state.chats = [];
    },
  },
});

export default markSlice.reducer;
