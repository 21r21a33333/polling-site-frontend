import { Suspense } from "react";
import PollsClient from "./PollsClient";
import { cookies } from "next/headers";

async function getPollsData(closed: boolean) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = cookies();

  try {
    const token = cookieStore.get("token")?.value;

    const response = await fetch(`${apiUrl}/api/polls?closed=${closed}`, {
      cache: "no-store",
      headers: {
        // Note: You'll need to handle authentication differently on the server
        // Consider using cookies or session tokens instead of localStorage
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch polls");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
}

export default async function PollsContainer({ closed }: { closed: boolean }) {
  const polls = await getPollsData(closed);

  return (
    <Suspense
      fallback={<div className="text-center text-lg">Loading polls...</div>}
    >
      <PollsClient initialPolls={polls} closed={closed} />
    </Suspense>
  );
}
