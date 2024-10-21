import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pollReducer from "./pollSlice";
import votereducer from "./voteSlice";
import pollStatsReducer from "./poolStatSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    poll: pollReducer,
    vote: votereducer,
    pollStats: pollStatsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
