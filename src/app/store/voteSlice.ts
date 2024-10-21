// src/features/poll/pollSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
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

interface Poll {
  id: number;
  title: string;
  description: string;
  creator_email: string;
  created_at: string;
  questions: Question[];
}

interface PollState {
  poll: Poll | null;
  answeredQuestions: number[]; // store question IDs that the user answered
}

// Load initial state from local storage if available
const savedPollState =
  typeof window !== "undefined" ? localStorage.getItem("pollState") : null;

const initialState: PollState = savedPollState
  ? JSON.parse(savedPollState)
  : {
      poll: null,
      answeredQuestions: [],
    };

// Create the slice
const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setPoll(state, action: PayloadAction<Poll>) {
      state.poll = action.payload;
      // Save poll to local storage
      localStorage.setItem("pollState", JSON.stringify(state));
    },
    answerQuestion(state, action: PayloadAction<number>) {
      state.answeredQuestions.push(action.payload);
      // Save updated state to local storage
      localStorage.setItem("pollState", JSON.stringify(state));
    },
    resetPoll(state) {
      state.poll = null;
      state.answeredQuestions = [];
      localStorage.removeItem("pollState");
    },
  },
});

// Export actions and selectors
export const { setPoll, answerQuestion, resetPoll } = pollSlice.actions;

import { RootState } from "./store"; // Adjust the import path as necessary

export const selectPoll = (state: RootState) => state.vote.poll;
export const selectAnsweredQuestions = (state: RootState) =>
  state.vote.answeredQuestions;

export default pollSlice.reducer;
