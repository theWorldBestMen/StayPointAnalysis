import { combineReducers } from "redux";
import userSlice from "../slices/user";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";

const persistConfig = {
  // 새로운 persist config를 선언해준다.
  key: "root",
  storage: storageSession,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default persistReducer(persistConfig, rootReducer);
