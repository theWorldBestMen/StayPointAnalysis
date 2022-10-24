import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: "",
  researcher: "",
  subjects: [],
  deviceId: "",
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
      state.deviceId = action.payload.device_id;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
