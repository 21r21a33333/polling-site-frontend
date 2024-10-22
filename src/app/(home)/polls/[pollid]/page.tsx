"use client";

import React from "react";

import PollHeader from "@/app/components/voting/PollHeader";
import QuestionComponent from "@/app/components/voting/QuestionComponent";
import VoteModal from "@/app/components/voting/VoteModal";
import useHandleVote from "@/app/hooks/useHandleVote";

const PollComponent = ({ params }: { params: { pollid: number } }) => {
  const {
    loading,
    error,
    poll,
    answeredQuestions,
    selectedOption,
    handleOptionSelect,
    submitVote,
    pollClosed,
    scores,
    modalVisible,
    closeModal,
  } = useHandleVote({ params });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!poll) return <div>No poll found</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <PollHeader title={poll.title} description={poll.description} />
      {poll.questions.map((question) => (
        <QuestionComponent
          key={question.id}
          question={question}
          answeredQuestions={answeredQuestions}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          submitVote={submitVote}
          pollClosed={pollClosed}
        />
      ))}

      <VoteModal
        scores={scores}
        modalVisible={modalVisible}
        closeModal={closeModal}
      />
    </div>
  );
};

export default PollComponent;
