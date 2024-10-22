import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { addQuestion, resetPoll } from "@/app/store/pollSlice";

export const usePollCreation = () => {
  const poll = JSON.parse(localStorage.getItem("pollState") || "{}");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [questionText, setQuestionText] = useState("");
  const [option, setOption] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const handleAddOption = () => {
    if (option && options.length < 4) {
      setOptions([...options, option]);
      setOption("");
    }
  };

  const handleAddQuestion = () => {
    if (questionText && options.length >= 2) {
      dispatch(addQuestion({ question_text: questionText, options }));
      setQuestionText("");
      setOptions([]);
    }
  };

  const handleSubmitPoll = async () => {
    let poll = JSON.parse(localStorage.getItem("pollState"));
    console.log("Submitting poll:", poll);
    const pollData = {
      title: poll.title,
      description: poll.description,
      creator_email: poll.creator_email,
      questions: poll.questions,
    };

    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(NEXT_PUBLIC_API_URL + "/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...pollData,
          creator_email: user,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create poll");
      }
      dispatch(resetPoll());
      setOptions([]);
      alert("Poll created successfully!");
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll.");
    }
  };

  return {
    poll,
    user,
    questionText,
    setQuestionText,
    option,
    setOption,
    options,
    handleAddOption,
    handleAddQuestion,
    handleSubmitPoll,
  };
};
