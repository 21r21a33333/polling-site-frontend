import Link from "next/link";
import React from "react";

import { RootState } from "@/app/store/store"; // Adjust the import path as necessary
import { useDispatch, useSelector } from "react-redux";
import { clearPollStats, fetchPollStats } from "@/app/store/poolStatSlice";
import { AppDispatch } from "@/app/store/store"; // Import AppDispatch type

function AdminUtils({ pollid, closed }: { pollid: number; closed: boolean }) {
  const dispatch2: AppDispatch = useDispatch(); // Type the dispatch correctly
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.auth.user);

  async function resetPoll() {
    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/polls/${pollid}/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to reset poll: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(clearPollStats());
      dispatch2(fetchPollStats(pollid));

      console.log("Poll reset successfully:", data);
      alert("Poll has been reset successfully!");
    } catch (error) {
      console.error("Error resetting poll:", error);
      alert(`Failed to reset the poll: ${(error as Error).message}`);
    }
  }

  async function closePoll() {
    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/polls/${pollid}/close`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to close poll: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch2(fetchPollStats(pollid));
      console.log("Poll closed successfully:", data);
      alert("Poll has been closed successfully!");
    } catch (error) {
      console.error("Error closing poll:", error);
      alert(`Failed to close the poll: ${(error as Error).message}`);
    }
  }

  return (
    <div className="flex justify-center mb-8">
      <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
        <Link href={`/polls/manage/${pollid}/live`}>
          <button className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
            GO LIVE
          </button>
        </Link>

        <button
          onClick={resetPoll}
          className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
          disabled={closed}
          title={
            closed
              ? "Poll must be open to reset"
              : "Resetting the poll will clear all votes"
          }
        >
          RESET POLL
        </button>

        <button
          onClick={closePoll}
          className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
          disabled={closed}
          title={closed ? "Poll is already closed" : "Close the poll"}
        >
          CLOSE POLL
        </button>
      </span>
    </div>
  );
}

export default AdminUtils;
