import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: "",
  researcher: "",
  subjects: [],
  device_info: {},
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
      state.researcher = action.payload.researcher;
      state.subjects = action.payload.subjects;
      state.device_info = action.payload.device_info;
      state.accessToken = action.payload.accessToken;
    },
    setDeviceInfo(state, action) {
      state.device_info = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
