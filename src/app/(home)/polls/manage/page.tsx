"use client";

import { useEffect, useState } from "react";
import PollCard from "@/app/components/polls/PollCard";
import { useSelector } from "react-redux";
import Pollsheading from "../../../components/polls/Pollsheading";

interface Poll {
  id: number;
  title: string;
  description: string;
  creator_email: string;
  created_at: string;
  closed: boolean;
}

const Page = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const creator: string = useSelector(
    (state: { auth: { user: string } }) => state.auth.user
  );
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/polls?creator=${creator}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cache: "no-store",
        });
        const closedResponse = await fetch(
          `${apiUrl}/api/polls?closed=true&creator=${creator}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cache: "no-store",
          }
        );

        if (!closedResponse.ok) {
          throw new Error("Failed to fetch closed polls");
        }

        const closedData: Poll[] = await closedResponse.json();
        if (!response.ok) {
          throw new Error("Failed to fetch polls");
        }
        const data: Poll[] = await response.json();
        data.push(...closedData);
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
  }, [creator]);

  if (loading)
    return <div className="text-center text-lg">Loading polls...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div>
      <Pollsheading content="My Open Polls" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-32 py-8">
        {polls.map(
          (poll) =>
            !poll.closed && <PollCard key={poll.id} poll={poll} admin={true} />
        )}
      </div>
      <Pollsheading content="My Closed Polls" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-32 py-8">
        {polls.map(
          (poll) =>
            poll.closed && <PollCard key={poll.id} poll={poll} admin={true} />
        )}
      </div>
    </div>
  );
};

export default Page;
