import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "./baseApi";
import { AppDispatch } from "./store";

interface LoginState {
  user: string | null;
  isLoading: boolean;
}

const initialState: LoginState = {
  user: null,
  isLoading: false,
};

// loginUser thunk
export const loginUser =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());

      const response = await axios.get(
        `${BASE_API_URL}/users?username=${username}&password=${password}`
      );

      if (response.data.length > 0) {
        dispatch(loginSuccess(username));
      } else {
        dispatch(loginFailure());
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure());
    }
  };

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    loginFailure: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = loginSlice.actions;

export default loginSlice.reducer;
