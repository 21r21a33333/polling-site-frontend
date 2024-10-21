import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Option {
  id: number;
  option_text: string;
  score: number;
}

interface Question {
  id: number;
  question_text: string;
  options: Option[];
}

interface PollStats {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  closed: boolean;
}

interface PollStatsState {
  pollStats: PollStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: PollStatsState = {
  pollStats: null,
  loading: false,
  error: null,
};

// Async thunk to fetch poll statistics
export const fetchPollStats = createAsyncThunk(
  "pollStats/fetchPollStats",
  async (pollId: number) => {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/polls/${pollId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch poll data");
    }
    return response.json();
  }
);

const pollStatsSlice = createSlice({
  name: "pollStats",
  initialState,
  reducers: {
    clearPollStats: (state) => {
      state.pollStats = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPollStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollStats.fulfilled, (state, action) => {
        state.pollStats = action.payload;
        state.loading = false;
      })
      .addCase(fetchPollStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load poll stats";
      });
  },
});

// Export actions and reducer
export const { clearPollStats } = pollStatsSlice.actions;
export default pollStatsSlice.reducer;
