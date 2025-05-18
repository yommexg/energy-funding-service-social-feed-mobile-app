import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { router } from "expo-router";

import { BASE_API_URL } from "@/redux/baseApi";
import { AppDispatch } from "@/redux/store";
import { User } from "@/utils/types/user";

interface LoginState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  user: null,
  isLoading: false,
  error: null,
};

export const loadUserFromStorage = () => async (dispatch: AppDispatch) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      const user: User = JSON.parse(userToken);
      dispatch(loginSuccess(user));

      router.replace({
        pathname: "/(user)",
      });
    } else {
      router.replace("/(auth)/login");
    }
  } catch (error) {
    router.replace("/(auth)/login");
    console.log(error);
  }
};

export const loginUser =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());

      const response = await axios.get(
        `${BASE_API_URL}/users?username=${username}&password=${password}`
      );

      if (response.data.length > 0) {
        const user = response.data[0];
        await AsyncStorage.setItem("userToken", JSON.stringify(user));
        dispatch(loginSuccess(user));
        router.replace({
          pathname: "/(user)",
        });
      } else {
        dispatch(loginFailure("Incorrect Credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure("An error occurred"));
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  await AsyncStorage.removeItem("userToken");
  dispatch(logout());
  router.replace({
    pathname: "/(auth)/login",
  });
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  loginSlice.actions;

export default loginSlice.reducer;
