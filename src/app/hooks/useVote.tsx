import { useState } from "react";
import { useGetPass } from "./useGetPass"; // Import the custom GetPass hook
import { useDispatch } from "react-redux";
import { answerQuestion } from "@/app/store/voteSlice";

export const useVote = () => {
  const { getPass, error } = useGetPass(); // Use the GetPass hook
  const dispatch = useDispatch();
  const [scores, setScores] = useState<any>({});

  const submitVote = async (
    pollId: number,
    questionId: number,
    optionId: number,
    email: string
  ) => {
    try {
      const pass_token = await getPass(email, optionId.toString());
      if (!pass_token) return;

      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/polls/${pollId}/vote`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            Authentication: `Bearer ${pass_token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) throw new Error("Failed to submit vote");

      // Fetch scores after submission
      const scoresResponse = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/polls/${pollId}/questions/${questionId}/scores`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const scoresData = await scoresResponse.json();
      setScores((prev) => ({ ...prev, [questionId]: scoresData }));

      // Mark the question as answered
      dispatch(answerQuestion(questionId));
    } catch (err) {
      console.error("Error submitting vote", err);
    }
  };

  return { submitVote, scores, error, setScores };
};
