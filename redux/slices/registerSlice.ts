import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { router } from "expo-router";

import { BASE_API_URL } from "@/redux/baseApi";

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

// 🔁 Thunk: Register User
export const registerUser = createAsyncThunk<
  string, // Return type
  { username: string; password: string }, // Args
  { rejectValue: string } // Error type
>("auth/registerUser", async ({ username, password }, { rejectWithValue }) => {
  try {
    // Check if user already exists
    const existingUser = await axios.get(
      `${BASE_API_URL}/users?username=${username}`
    );
    if (existingUser.data.length > 0) {
      return rejectWithValue("Username already taken");
    }

    // Register new user
    const response = await axios.post(`${BASE_API_URL}/users`, {
      username,
      password,
    });

    if (response.status === 201) {
      router.replace("/(auth)/login");
      return username;
    } else {
      return rejectWithValue("Registration failed");
    }
  } catch (error) {
    console.error("Register error:", error);
    return rejectWithValue("An error occurred during registration");
  }
});

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
        state.user = null;
      });
  },
});

export default registerSlice.reducer;
