import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import rootReducer from "./reducer";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    // if (__DEV__) {
    //   const createDebugger = require("redux-flipper").default;
    //   return getDefaultMiddleware().concat(createDebugger());
    // }
    return getDefaultMiddleware();
  },
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default { store, persistor };
