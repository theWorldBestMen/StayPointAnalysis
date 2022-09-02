import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// store -> reducer(root, state) -> user slice, order slice
// state.user
// state.order
// state.ui -> initialState: loading : false ...

// action: state를 바구는 행위/동작
// dispatch: 그 액션을 실제로 실행하는 함수
// reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

const initialState = {
  name: "",
  email: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken; // 유효기간 (10분, 5분, 1시간 등)
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
