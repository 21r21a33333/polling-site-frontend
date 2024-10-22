"use client";

import { useState, useEffect } from "react";
import PollCard from "./PollCard";
import Pagination from "../Pagination";

interface Poll {
  id: number;
  title: string;
  description: string;
  creator_email: string;
  created_at: string;
  closed: boolean;
}

interface PollsClientProps {
  initialPolls: Poll[];
  closed: boolean;
}

export default function PollsClient({
  initialPolls,
  closed,
}: PollsClientProps) {
  const [polls] = useState<Poll[]>(initialPolls);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pollsPerPage = 6;

  // Calculate pagination values
  const totalPolls = polls.length;
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
  const totalPages = Math.ceil(totalPolls / pollsPerPage);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  // Get current page from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    if (pageParam) {
      setCurrentPage(Number(pageParam));
    }
  }, []);

  return (
    <div className="px-32 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
}
