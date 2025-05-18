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

// Thunk with pagination, filtering, sorting
export const fetchPosts = createAsyncThunk<
  { posts: Post[]; totalCount: number },
  {
    page: number;
    limit?: number;
    filters?: Record<string, any>;
    sortBy?: string;
  },
  { rejectValue: string }
>(
  "feed/fetchPosts",
  async (
    { page, limit = 10, filters = {}, sortBy = "created_at" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/posts`);
      let allPosts: Post[] = response.data ?? [];

      // Filtering
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          allPosts = allPosts.filter((post) => {
            const field = post[key as keyof Post];

            return Array.isArray(field)
              ? field.includes(value)
              : field === value;
          });
        }
      });

      // Sorting
      allPosts.sort((a, b) => {
        const aVal = a[sortBy as keyof Post];
        const bVal = b[sortBy as keyof Post];

        const aDate =
          typeof aVal === "string" ||
          typeof aVal === "number" ||
          aVal instanceof Date
            ? new Date(aVal).getTime()
            : 0;

        const bDate =
          typeof bVal === "string" ||
          typeof bVal === "number" ||
          bVal instanceof Date
            ? new Date(bVal).getTime()
            : 0;

        return bDate - aDate;
      });

      // Pagination
      const start = (page - 1) * limit;
      const paginatedPosts = allPosts.slice(start, start + limit);

      return { posts: paginatedPosts, totalCount: allPosts.length };
    } catch (error) {
      console.error("Fetch posts error:", error);
      return rejectWithValue("Failed to load posts.");
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
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
          state.posts = posts;
        } else {
          // Deduplicate by ID
          const existingIds = new Set(state.posts.map((p) => p.id));
          const newPosts = posts.filter((p) => !existingIds.has(p.id));
          state.posts.push(...newPosts);
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

export default feedSlice.reducer;
