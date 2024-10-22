import React from "react";
import Pollsheading from "../../components/polls/Pollsheading";
import Polls from "../../components/polls/ClosedPolls";


function page() {
  return (
    <div>
      <Pollsheading content="Currently Open" />
      <Polls closed={false} />
      <Pollsheading content="Closed Closed" />
      <Polls closed={true} />
    </div>
  );
}

export default page;
