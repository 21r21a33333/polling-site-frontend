"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { fetchPollStats, clearPollStats } from "@/app/store/poolStatSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import AdminUtils from "./AdminUtils";

const PollStatsDashboard = ({ params }: { params: { pollid: number } }) => {
  const pollId = params.pollid;
  const dispatch: AppDispatch = useDispatch();

  // Use the poll stats slice
  const { pollStats, loading, error } = useSelector(
    (state: RootState) => state.pollStats
  );
  const closed = pollStats?.closed;

  // Fetch poll stats when pollId changes
  useEffect(() => {
    dispatch(fetchPollStats(pollId));
    return () => {
      dispatch(clearPollStats()); // Clear stats on unmount
    };
  }, [pollId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!pollStats) return <div>No poll found</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <AdminUtils pollid={pollId} closed={closed} />
      <h1 className="text-2xl font-bold mb-4">{pollStats.title} Statistics</h1>
      <p className="mb-4">{pollStats.description}</p>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      {pollStats.questions.map((question) => {
        const totalVotes = question.options.reduce(
          (total, option) => total + option.score,
          0
        );

        // Prepare data for the pie chart
        const pieData = question.options.map((option) => ({
          name: option.option_text,
          value: option.score,
          percentage: totalVotes > 0 ? (option.score / totalVotes) * 100 : 0,
        }));

        return (
          <div key={question.id} className="mb-6">
            <h3 className="text-lg font-medium mb-2 font-bold">
              {question.question_text}
            </h3>
            {totalVotes > 0 ? (
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(index)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div className="font-bold text-red-500">No votes</div>
            )}
            <div className="mt-2">
              {pieData.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 mr-2"
                    style={{
                      backgroundColor: getColor(index),
                      borderRadius: "50%",
                    }}
                  />
                  <span>
                    {option.name}: {option.value} votes (
                    {option.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          </div>
        );
      })}
    </div>
  );
};

// Helper function to get colors for the pie chart
const getColor = (index: number) => {
  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF5733",
    "#9C27B0",
  ];
  return colors[index % colors.length];
};

export default PollStatsDashboard;
