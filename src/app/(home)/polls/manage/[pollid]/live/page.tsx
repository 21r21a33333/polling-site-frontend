"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store"; // Adjust the import path
import { fetchPollStats } from "@/app/store/poolStatSlice";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { headers } from "next/headers";

interface PageProps {
  params: {
    pollid: number;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const pollStats = useSelector(
    (state: RootState) => state.pollStats.pollStats
  );
  const pollid = params.pollid;
  let wsBaseUrl = process.env.NEXT_PUBLIC_API_URL || "ws://localhost:3001";
  wsBaseUrl = wsBaseUrl.split("//")[1];
  const wsUrl = `ws://${wsBaseUrl}/ws/${pollid}`;
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch poll data on first render
    const fetchData = async () => {
      setLoading(true); // Start loading
      await dispatch(fetchPollStats(pollid));
      setLoading(false); // Stop loading
    };

    fetchData();

    // Create WebSocket connection
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Connected to WebSocket server.");
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      if (event.data.startsWith("update")) {
        // Fetch updated poll stats when "update" message is received
        setLoading(true); // Start loading for updates
        dispatch(fetchPollStats(pollid)).finally(() => setLoading(false)); // Stop loading after fetching
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Cleanup the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [wsUrl, pollid, dispatch]);

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

  return (
    <div>
      {loading ? ( // Show loading indicator while fetching data
        <p className="text-yellow-500">Updating poll data...</p>
      ) : (
        pollStats && (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {pollStats.title} Statistics
            </h1>
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
                percentage:
                  totalVotes > 0 ? (option.score / totalVotes) * 100 : 0,
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
        )
      )}
    </div>
  );
};

export default Page;
