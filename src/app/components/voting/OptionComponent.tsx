"use client";
import React from "react";

const OptionComponent = ({
  option,
  handleOptionSelect,
  selectedOption,
  questionId,
  pollClosed,
}: {
  option: any;
  handleOptionSelect: (questionId: number, optionId: number) => void;
  selectedOption: { [key: number]: number };
  questionId: number;
  pollClosed: boolean;
}) => {
  return (
    <div
      key={option.id}
<<<<<<< HEAD
      className="flex items-center ps-4 border border-gray-200 rounded mb-2 "
=======
      className="flex items-center ps-4 border border-gray-200 rounded mb-2"
>>>>>>> 7fdbd6bd19fcafe56a7513a258f4601ad01f7118
    >
      <input
        type="radio"
        name={`question-${questionId}`}
        value={option.id}
        onChange={() => handleOptionSelect(questionId, option.id)}
        checked={selectedOption[questionId] === option.id}
        className="w-4 h-4 text-blue-600"
        disabled={pollClosed}
      />
      <label className="w-full py-4 ms-2 text-sm font-medium">
        {option.option_text}
      </label>
    </div>
  );
};

export default OptionComponent;
