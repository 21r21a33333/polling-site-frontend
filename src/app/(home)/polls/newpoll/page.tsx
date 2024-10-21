"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  setTitle,
  setDescription,
  setCreatorEmail,
  addQuestion,
  resetPoll,
} from "@/app/store/pollSlice";

const PollCreation = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [questionText, setQuestionText] = useState("");
  const [option, setOption] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const dispatch = useDispatch();
  const poll = useSelector((state: RootState) => state.poll);

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
      alert("Poll created successfully!");
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll.");
    }
  };

  return (
    <div className="p-4 w-[80vw] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Poll</h1>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Poll Title</label>
        <input
          type="text"
          value={poll.title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
          className="border rounded p-2 w-full"
          placeholder="Enter poll title"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          value={poll.description}
          onChange={(e) => dispatch(setDescription(e.target.value))}
          className="border rounded p-2 w-full"
          placeholder="Enter description"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Creator Email</label>
        <input
          type="email"
          value={poll.creator_email}
          className="border rounded p-2 w-full"
          placeholder={user ?? ""}
          disabled={true}
        />
      </div>

      {/* Display added questions */}
      {poll.questions.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Added Questions:</h3>
          {poll.questions.map((question, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-lg mb-4 dark:border-gray-700"
            >
              <h4 className="font-medium text-lg mb-2">
                {question.question_text}
              </h4>
              {question.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mb-2"
                >
                  <label
                    htmlFor={`checkbox-${index}-${optIndex}`}
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 "
                  >
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Question input form */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Question</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter question"
        />

        <div className="mt-2">
          <label className="block font-medium">
            Options (at least 2 required)
          </label>
          <input
            type="text"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="border rounded p-2 w-full mt-2"
            placeholder="Enter option"
          />
          <div className="flex justify-center mt-2">
            <button
              onClick={handleAddOption}
              className="bg-black text-white p-2 rounded w-1/2"
            >
              Add Option
            </button>
          </div>

          <div className="mt-2">
            {options.map((opt, index) => (
              <div key={index} className="p-2 bg-gray-200 rounded my-1">
                {opt}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleAddQuestion}
            disabled={options.length < 2}
            className="bg-blue-500 text-white p-2 rounded w-1/2"
          >
            Add Question
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmitPoll}
        className="bg-black text-white p-2 rounded w-full mt-4"
      >
        Submit Poll
      </button>
    </div>
  );
};

export default PollCreation;
