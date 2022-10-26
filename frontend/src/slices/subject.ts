import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  device_info: {},
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubject(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.device_info = action.payload.device_info;
    },
  },
  extraReducers: (builder) => {},
});

export default subjectSlice;
