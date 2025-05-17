import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import loginReducer from "./loginSlice";
import registerReducer from "./registerSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
