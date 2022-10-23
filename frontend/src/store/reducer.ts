import { combineReducers } from "redux";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";
import userSlice from "../slices/user";
import subjectSlice from "../slices/subject";

const persistConfig = {
  // 새로운 persist config를 선언해준다.
  key: "root",
  storage: storageSession,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  subject: subjectSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default persistReducer(persistConfig, rootReducer);
