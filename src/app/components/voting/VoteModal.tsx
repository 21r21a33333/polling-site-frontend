"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VoteModal = ({
  scores,
  modalVisible,
  closeModal,
}: {
  scores: any;
  modalVisible: boolean;
  closeModal: () => void;
}) => {
  if (!modalVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Vote Statistics</h2>
        {Object.entries(scores).map(([questionId, scoreData]: any) => {
          const totalVotes = scoreData.options.reduce(
            (total: number, option: any) => total + option.score,
            0
          );

          const chartData = scoreData.options.map((option: any) => ({
            name: option.option_text,
            votes: option.score,
            percentage: totalVotes > 0 ? (option.score / totalVotes) * 100 : 0,
          }));

          return (
            <div key={questionId} className="mb-4">
              <h3 className="font-medium">{scoreData.question_id}</h3>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>

              {scoreData.options.map((option: any) => {
                const percentage =
                  totalVotes > 0 ? (option.score / totalVotes) * 100 : 0;

                return (
                  <div key={option.id} className="mb-2">
                    <div className="flex items-center justify-between">
                      <span>{option.option_text}</span>
                      <span>{option.score} votes</span>
                    </div>
                    <span className="text-sm">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          );
        })}
        <button
          onClick={closeModal}
          className="bg-black text-white py-2 px-4 rounded mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VoteModal;
