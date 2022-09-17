import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken; // 유효기간 (10분, 5분, 1시간 등)
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
