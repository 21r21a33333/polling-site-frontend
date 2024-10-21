"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPoll,
  answerQuestion,
  selectPoll,
  selectAnsweredQuestions,
} from "@/app/store/voteSlice";
import { RootState } from "@/app/store/store";
import { resetPoll } from "@/app/store/pollSlice";
import { startAuthentication } from "@simplewebauthn/browser";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Import Recharts components

const PollComponent = ({
  params,
}: {
  params: {
    pollid: number;
  };
}) => {
  const pollId = params.pollid;
  const email = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.auth.user);
  const poll = useSelector((state: RootState) => selectPoll(state));
  const answeredQuestions = useSelector((state: RootState) =>
    selectAnsweredQuestions(state)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState<{
    [key: number]: number;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [scores, setScores] = useState<{
    [key: number]: {
      question_id: number;
      options: { id: number; option_text: string; score: number }[];
    };
  }>({});
  const [pollClosed, setPollClosed] = useState(false); // New state variable

  // Fetch poll data
  useEffect(() => {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
    const fetchPoll = async () => {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_API_URL}/api/polls/${pollId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch poll");
        const data = await response.json();
        dispatch(setPoll(data));
        setPollClosed(data.closed); // Set pollClosed based on fetched data
        setLoading(false);
      } catch (err) {
        setError("Error fetching poll data");
        console.error("Error fetching poll data", err);
        setLoading(false);
      }
    };
    fetchPoll();
    return () => {
      dispatch(resetPoll()); // Clear the poll state in Redux and localStorage
    };
  }, [dispatch, pollId]);

  // Check if questions have been answered
  useEffect(() => {
    if (poll && poll.questions.length > 0) {
      poll.questions.forEach(async (question) => {
        try {
          const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/question_attempted?email=${userEmail}&qid=${question.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          if (data.answered) {
            dispatch(answerQuestion(question.id));
          }
        } catch (err) {
          console.error("Error checking question", err);
        }
      });
    }
  }, [poll, userEmail, dispatch]);

  // Handle option selection
  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedOption((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleRegister = async (option_id: string) => {
    setError(""); // Clear any previous errors
    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const resp = await fetch(NEXT_PUBLIC_API_URL + "/start_verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 400) {
          setError("User Not Found");
        } else {
          setError(`Server error: ${resp.status} ${resp.statusText}`);
        }
        return;
      }

      const data = await resp.json();
      if (!data || !data.publicKey) {
        setError("Invalid server response: missing publicKey");
        return;
      }
      // console.log(data);
      try {
        const obj = data.publicKey;
        const attResp = await startAuthentication({ optionsJSON: obj });
        // console.log("Login response:", attResp); // Debug log

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyRegistrationResponse()
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
        const verificationResp = await fetch(NEXT_PUBLIC_API_URL + "/getpass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email,
            public_key_credential: attResp,
            option_id: option_id,
          }),
        });

        // Wait for the results of verification
        console.log("Waiting for verification response..."); // Debug log
        const verificationJSON = await verificationResp.json();
        // console.log("Verification response:", verificationJSON); // Debug log
        // Handle successful registration (e.g., redirect or update UI)
        // Save token to localStorage
        const token = verificationJSON.vote_token;
        return token;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Login error:", error);
          setError(`Login error: ${error.name} - ${error.message}`);
        } else {
          setError("An unknown error occurred during Login");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error during Login");
    }
  };

  // Submit vote
  const submitVote = async (questionId: number) => {
    if (!selectedOption[questionId]) return;

    try {
      const pass_token = await handleRegister(
        selectedOption[questionId].toString()
      );
      console.log(pass_token);
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
      setModalVisible(true); // Show the modal after fetching scores

      dispatch(answerQuestion(questionId));
    } catch (err) {
      console.error("Error submitting vote", err);
    }
  };

  // Close modal
  const closeModal = () => {
    setScores({}); // Clear scores
    setModalVisible(false);
    setSelectedOption({});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!poll) return <div>No poll found</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      <p className="mb-4">{poll.description}</p>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      {poll.questions.map((question) => (
        <div key={question.id} className="mb-6">
          <h3 className="text-lg font-medium mb-2 font-bold">
            {question.question_text}
          </h3>

          {/* Check if the question has been answered */}
          {answeredQuestions.includes(question.id) ? (
            <div className="text-green-500">
              You have already answered this question.
            </div>
          ) : (
            <>
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center ps-4 border border-gray-200 rounded mb-2"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    onChange={() => handleOptionSelect(question.id, option.id)}
                    checked={selectedOption[question.id] === option.id}
                    className="w-4 h-4 text-blue-600"
                    disabled={pollClosed} // Disable input if poll is closed
                  />
                  <label className="w-full py-4 ms-2 text-sm font-medium">
                    {option.option_text}
                  </label>
                </div>
              ))}
              <button
                onClick={() => submitVote(question.id)}
                className="bg-black text-white py-2 px-4 rounded mt-4"
                disabled={pollClosed || !selectedOption[question.id]} // Disable button if poll is closed
              >
                {pollClosed ? "Cannot Submit" : "Submit Vote"}
              </button>
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            </>
          )}
        </div>
      ))}

      {/* Modal for displaying scores */}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Vote Statistics</h2>
            {Object.entries(scores).map(([questionId, scoreData]) => {
              // Prepare data for the chart
              const totalVotes = scoreData.options.reduce(
                (total, option) => total + option.score,
                0
              );

              const chartData = scoreData.options.map((option) => ({
                name: option.option_text,
                votes: option.score,
                percentage:
                  totalVotes > 0 ? (option.score / totalVotes) * 100 : 0,
              }));

              return (
                <div key={questionId} className="mb-4">
                  <h3 className="font-medium">{scoreData.question_id}</h3>

                  {/* Recharts Bar Chart */}
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>

                  {scoreData.options.map((option) => {
                    const percentage =
                      totalVotes > 0 ? (option.score / totalVotes) * 100 : 0;

                    return (
                      <div key={option.id} className="mb-2">
                        <div className="flex items-center justify-between">
                          <span>{option.option_text}</span>
                          <span>{option.score} votes</span>
                        </div>
                        <span className="text-sm">
                          {percentage.toFixed(1)}%
                        </span>
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
      )}
    </div>
  );
};

export default PollComponent;
