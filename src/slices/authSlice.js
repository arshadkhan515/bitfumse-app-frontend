import { createSlice } from '@reduxjs/toolkit'

export const AuthSlice = createSlice({
  name: 'auth',
  initialState : {
    isAuthenticate: false,
    user : {}
  },
  reducers: {
    getUser: (state) => {
      state.user = {name:"arshad"};
      state.isAuthenticate = true;
    },
    setUser: (state,action) => {
      state.user = action.payload;
      state.isAuthenticate = true;
    },
    logout: (state) => {
      state.user = {};
      state.isAuthenticate = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const { getUser,setUser,logout } = AuthSlice.actions

export default AuthSlice.reducer