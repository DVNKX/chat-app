import {createSlice} from '@reduxjs/toolkit';

export interface IUserStore {
  email: string;
  id: string;
  name: string;
  surname: string;
  image?: string;
}

const initialState: IUserStore = {
  email: '',
  id: '',
  name: '',
  surname: '',
  image: '',
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
    deleteImage(state) {
      state.image = '';
    },
    logOut(state) {
      state.email = '';
      state.id = '';
      state.name = '';
      state.surname = '';
      state.image = '';
    },
  },
});

export default userSlice.reducer;
