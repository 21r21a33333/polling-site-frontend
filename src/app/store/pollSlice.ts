import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PollOption {
  question_text: string;
  options: string[];
}

interface PollState {
  title: string;
  description: string;
  creator_email: string;
  questions: PollOption[];
}

const initialState: PollState = {
  title: "",
  description: "",
  creator_email: "",
  questions: [],
};

// Load initial state from local storage
const savedPollState =
  typeof window !== "undefined" ? localStorage.getItem("pollState") : null;
if (savedPollState) {
  Object.assign(initialState, JSON.parse(savedPollState));
}

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      localStorage.setItem("pollState", JSON.stringify(state)); // Persist to local storage
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
      localStorage.setItem("pollState", JSON.stringify(state));
    },
    setCreatorEmail: (state, action: PayloadAction<string>) => {
      state.creator_email = action.payload;
      localStorage.setItem("pollState", JSON.stringify(state));
    },
    addQuestion: (state, action: PayloadAction<PollOption>) => {
      state.questions.push(action.payload);
      localStorage.setItem("pollState", JSON.stringify(state));
    },
    resetPoll: (state) => {
      state.title = "";
      state.description = "";
      state.creator_email = "";
      state.questions = [];

      localStorage.removeItem("pollState");
    },
  },
});

export const {
  setTitle,
  setDescription,
  setCreatorEmail,
  addQuestion,
  resetPoll,
} = pollSlice.actions;
export default pollSlice.reducer;
