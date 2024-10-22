"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store"; // Adjust the import path
import { fetchPollStats } from "@/app/store/poolStatSlice";
import { WebSocketHandler } from "@/app/components/live/WebSocketHandler";
import { PollStatHeader } from "@/app/components/live/PollStatHeader ";
import { QuestionBlock } from "@/app/components/live/QuestionBlock";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchPollStats(pollid));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, pollid]);

  return (
    <div>
      <WebSocketHandler
        pollid={pollid}
        dispatch={dispatch}
        setLoading={setLoading}
      />
      {loading ? (
        <p className="text-yellow-500">Updating poll data...</p>
      ) : (
        pollStats && (
          <div className="p-4 max-w-xl mx-auto">
            <PollStatHeader
              title={pollStats.title}
              description={pollStats.description}
            />
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {pollStats.questions.map((question) => (
              <QuestionBlock key={question.id} question={question} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Page;
