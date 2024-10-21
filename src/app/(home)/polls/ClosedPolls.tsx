"use client";

import { useEffect, useState } from "react";
import PollCard from "@/app/components/polls/PollCard";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
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
  }, []);

  if (loading)
    return <div className="text-center text-lg">Loading polls...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-32 py-8">
      {polls.map((poll) => (
        <PollCard poll={poll} key={poll.id} />
      ))}
    </div>
  );
};

export default Polls;
