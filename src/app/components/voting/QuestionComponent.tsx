"use client";

import React from "react";
import OptionComponent from "./OptionComponent";

const QuestionComponent = ({
  question,
  answeredQuestions,
  selectedOption,
  handleOptionSelect,
  submitVote,
  pollClosed,
}: {
  question: any;
  answeredQuestions: number[];
  selectedOption: { [key: number]: number };
  handleOptionSelect: (questionId: number, optionId: number) => void;
  submitVote: (questionId: number) => void;
  pollClosed: boolean;
}) => {
  return (
    <div key={question.id} className="mb-6">
      <h3 className="text-lg font-medium mb-2 font-bold">
        {question.question_text}
      </h3>

      {answeredQuestions.includes(question.id) ? (
        <div className="text-green-500">
          You have already answered this question.
        </div>
      ) : (
        <>
          {question.options.map((option: any) => (
            <OptionComponent
              key={option.id}
              option={option}
              handleOptionSelect={handleOptionSelect}
              selectedOption={selectedOption}
              questionId={question.id}
              pollClosed={pollClosed}
            />
          ))}
          <button
            onClick={() => submitVote(question.id)}
            className="bg-black text-white py-2 px-4 rounded mt-4"
            disabled={pollClosed || !selectedOption[question.id]}
          >
            {pollClosed ? "Cannot Submit" : "Submit Vote"}
          </button>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        </>
      )}
    </div>
  );
};

export default QuestionComponent;
