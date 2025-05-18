import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import feedReducer from "@/redux/slices/feedSlice";
import loginReducer from "@/redux/slices/loginSlice";
import registerReducer from "@/redux/slices/registerSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    feed: feedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
