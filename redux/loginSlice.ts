import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { router } from "expo-router";
import { BASE_API_URL } from "./baseApi";
import { AppDispatch } from "./store";

interface LoginState {
  user: string | null;
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
      router.replace({
        pathname: "/(user)",
      });
      dispatch(loginSuccess(userToken));
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

      console.log(response.data);

      if (response.data.length > 0) {
        console.log("You");
        await AsyncStorage.setItem("userToken", username);
        dispatch(loginSuccess(username));
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
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
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
