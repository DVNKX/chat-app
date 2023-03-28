import {createSlice} from '@reduxjs/toolkit';

export interface IUserStore {
  email: null;
  id: null;
  name: null;
  surname?: null;
  image?: null;
}

const initialState: IUserStore = {
  email: null,
  id: null,
  name: null,
  surname: null,
  image: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
    setInfo(state, action) {
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.email = action.payload.email;
      state.image = action.payload.image;
    },
    logOut(state) {
      state.email = null;
      state.id = null;
      state.name = null;
      state.surname = null;
      state.image = null;
    },
  },
});

export default userSlice.reducer;
