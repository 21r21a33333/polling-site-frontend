"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const QuestionList = () => {
  const questions = useSelector((state: RootState) => state.poll.questions);

  return (
    <>
      {questions.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Added Questions:</h3>
          {questions.map((question, index) => (
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
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                  >
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default QuestionList;
