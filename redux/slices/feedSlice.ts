import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_API_URL } from "@/redux/baseApi";
import { Post } from "@/utils/types/post";

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
};

// Thunk to fetch paginated posts
export const fetchPosts = createAsyncThunk<
  { posts: Post[]; totalCount: number },
  { page: number; limit?: number },
  { rejectValue: string }
>("feed/fetchPosts", async ({ page, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/posts`);

    // Get all posts from the nested object
    const allPosts: Post[] = response.data ?? [];

    // Sort posts by created_at descending (if not sorted)
    allPosts.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Slice posts for the current page
    const start = (page - 1) * limit;
    const paginatedPosts = allPosts.slice(start, start + limit);

    return { posts: paginatedPosts, totalCount: allPosts.length };
  } catch (error) {
    console.error("Fetch posts error:", error);
    return rejectWithValue("Failed to load posts.");
  }
});

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    resetFeed(state) {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.isLoading = true;
          state.error = null;
        }
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, totalCount } = action.payload;

        if (action.meta.arg.page === 1) {
          state.posts = posts; // Replace on first page
        } else {
          state.posts = [...state.posts, ...posts];
        }

        state.page = action.meta.arg.page;
        state.isLoading = false;

        state.hasMore = state.posts.length < totalCount;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Something went wrong.";
      });
  },
});

export const { resetFeed } = feedSlice.actions;
export default feedSlice.reducer;
