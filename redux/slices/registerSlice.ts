import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { router } from "expo-router";
import { BASE_API_URL } from "./baseApi";
import { AppDispatch } from "./store";

interface RegisterState {
  user: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunk for registering a user
export const registerUser =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerStart());

      // Check if user already exists
      const existingUser = await axios.get(
        `${BASE_API_URL}/users?username=${username}`
      );

      if (existingUser.data.length > 0) {
        // User exists, throw error
        dispatch(registerFailure("Username already taken"));
        return;
      }

      // Register new user by POST request
      const response = await axios.post(`${BASE_API_URL}/users`, {
        username,
        password,
      });

      if (response.status === 201) {
        dispatch(registerSuccess(username));
        router.replace("/(auth)/login");
      } else {
        dispatch(registerFailure("Registration failed"));
      }
    } catch (error) {
      console.error("Register error:", error);
      dispatch(registerFailure("An error occurred"));
    }
  };

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
    },
  },
});

export const { registerStart, registerSuccess, registerFailure } =
  registerSlice.actions;

export default registerSlice.reducer;
