import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { router } from "expo-router";

import { BASE_API_URL } from "@/redux/baseApi";
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

// 🔁 Thunk: Login user
export const loginUser = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/users?username=${username}&password=${password}`
    );

    if (response.data.length > 0) {
      const user = response.data[0];
      await AsyncStorage.setItem("userToken", JSON.stringify(user));
      router.replace("/(user)");
      return user;
    } else {
      return rejectWithValue("Incorrect credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    return rejectWithValue("Login failed. Please try again.");
  }
});

// 🔁 Thunk: Load user from storage (for persistent login)
export const loadUserFromStorage = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/loadUserFromStorage", async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      const user = JSON.parse(token);
      router.replace("/(user)");
      return user;
    } else {
      router.replace("/(auth)/login");
      return null;
    }
  } catch (e) {
    console.error(e);
    router.replace("/(auth)/login");
    return rejectWithValue("Failed to load user.");
  }
});

// 🔁 Thunk: Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await AsyncStorage.removeItem("userToken");
  router.replace("/(auth)/login");
});

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.user = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload || null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export default loginSlice.reducer;
