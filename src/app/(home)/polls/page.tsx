import PollsContainer from "@/app/components/polls/PollsContainer";
import Pollsheading from "@/app/components/polls/Pollsheading";

export default function PollsPage() {
  return (
    <div>
      <Pollsheading content="Currently Open" />
      <PollsContainer closed={false} />
      <Pollsheading content="Closed Polls" />
      <PollsContainer closed={true} />
    </div>
  );
}
