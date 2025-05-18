import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_API_URL } from "@/redux/baseApi";
import { Post } from "@/utils/types/post";

interface FeedState {
  posts: Post[];
  isLodaing: boolean;
  error: string | null;
}

const initialState: FeedState = {
  posts: [],
  isLodaing: false,
  error: null,
};

// 🔁 Thunk: Fetch all posts
export const fetchPosts = createAsyncThunk<
  Post[],
  void,
  { rejectValue: string }
>("feed/fetchPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/posts?_sort=created_at&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Fetch posts error:", error);
    return rejectWithValue("Failed to load posts.");
  }
});

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLodaing = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.isLodaing = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLodaing = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export default feedSlice.reducer;
