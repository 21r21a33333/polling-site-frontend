"use client";
import PollTitle from "@/app/components/createPoll/PollTitle";
import PollDescription from "@/app/components/createPoll/PollDescription";
import QuestionForm from "@/app/components/createPoll/QuestionForm";
import QuestionList from "@/app/components/createPoll/QuestionList";
import { usePollCreation } from "@/app/hooks/usePollCreation";

const PollCreation = () => {
  const { poll, user, handleSubmitPoll } = usePollCreation();

  return (
    <div className="p-4 w-[80vw] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Poll</h1>

      <PollTitle />
      <PollDescription />

      {/* Creator Email */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Creator Email</label>
        <input
          type="email"
          value={poll.creator_email}
          className="border rounded p-2 w-full"
          placeholder={user ?? ""}
          disabled
        />
      </div>

      <QuestionList />
      <QuestionForm />

      <button
        onClick={handleSubmitPoll}
        className="bg-black text-white p-2 rounded w-full mt-4"
      >
        Submit Poll
      </button>
    </div>
  );
};

export default PollCreation;
