"use client";
import { RootState } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  selectPoll,
  resetPoll,
  selectAnsweredQuestions,
  setPoll,
  answerQuestion,
} from "../store/voteSlice";
import { startAuthentication } from "@simplewebauthn/browser";

function useHandleVote({
  params,
}: {
  params: {
    pollid: number;
  };
}) {
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
  const [scores, setScores] = useState<any>({});
  const [pollClosed, setPollClosed] = useState(false);

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

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedOption((prev) => ({ ...prev, [questionId]: optionId }));
  };
  const GetPass = async (option_id: string) => {
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
      const pass_token = await GetPass(selectedOption[questionId].toString());
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

      // Show success toast after fetching scores
      toast.success("Answered successfully!");
      setModalVisible(true); // Show the modal after fetching scores

      dispatch(answerQuestion(questionId));
    } catch (err) {
      console.error("Error submitting vote", err);
    }
  };

  const closeModal = () => {
    setScores({});
    setModalVisible(false);
    setSelectedOption({});
  };

  return {
    poll,
    loading,
    error,
    selectedOption,
    modalVisible,
    scores,
    pollClosed,
    handleOptionSelect,
    submitVote,
    closeModal,
    answeredQuestions,
  };
}

export default useHandleVote;
