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
              className="p-4 rounded-lg mb-4 dark:border-gray-700 shadow-lg"
            >
              <h4 className="font-medium text-lg mb-2">
                {question.question_text.toLocaleUpperCase()}
              </h4>
              {question.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 mt-2"
                >
                  <label
                    htmlFor={`checkbox-${index}-${optIndex}`}
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                  >
                    {opt.toLocaleUpperCase()}
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
