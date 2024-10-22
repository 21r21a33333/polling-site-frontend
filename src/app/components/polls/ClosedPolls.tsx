"use client";

import { useEffect, useState } from "react";
import PollCard from "@/app/components/polls/PollCard";
import Pagination from "@/app/components/Pagination"; // Import the new Pagination component

interface Poll {
  id: number;
  title: string;
  description: string;
  creator_email: string;
  created_at: string;
  closed: boolean;
}

const Polls = ({ closed }: { closed: boolean }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pollsPerPage] = useState<number>(6); // Adjust the number of polls per page here
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Function to fetch polls
    const fetchPolls = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/polls?closed=${closed}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch polls");
        }
        const data: Poll[] = await response.json();
        setPolls(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [apiUrl, closed]);

  // Calculate total polls and the current polls to display
  const totalPolls = polls.length;
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);

  // Handle pagination
  const totalPages = Math.ceil(totalPolls / pollsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update the URL without refreshing the page
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  // Retrieve the current page from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    if (pageParam) {
      setCurrentPage(Number(pageParam));
    }
  }, []);

  if (loading)
    return <div className="text-center text-lg">Loading polls...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="px-32 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {currentPolls.map((poll) => (
          <PollCard poll={poll} key={poll.id} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Polls;
