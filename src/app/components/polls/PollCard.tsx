import Link from "next/link";
import React from "react";
interface Poll {
  id: number;
  title: string;
  description: string;
  creator_email: string;
  created_at: string;
  closed: boolean;
}

function PollCard({ poll, admin = false }: { poll: Poll; admin?: boolean }) {
  return (
    <div key={poll.id} className="bg-white shadow-lg rounded-lg p-6">
      <Link href={admin ? `/polls/manage/${poll.id}` : `/polls/${poll.id}`}>
        <h1 className="text-xl font-bold mb-2">
          {poll.title.length > 35
            ? `${poll.title.substring(0, 35)}...`
            : poll.title}
        </h1>
        <p className="text-gray-600 mb-4">
          {poll.description.length > 100
            ? `${poll.description.substring(0, 100)}...`
            : poll.description}
        </p>
        <p className="text-sm text-gray-500">
          Created by: {poll.creator_email}
        </p>
        <p className="text-sm text-gray-500">Created at: {poll.created_at}</p>
        <p
          className={`text-sm font-semibold mt-2 ${
            poll.closed ? "text-red-500" : "text-green-500"
          }`}
        >
          {poll.closed ? "Closed" : "Open"}
        </p>
      </Link>
    </div>
  );
}

export default PollCard;
