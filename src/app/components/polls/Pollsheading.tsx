import React from "react";

function Pollsheading({ content }: { content: string }) {
  return (
    <div className="flex justify-center">
      <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 ">
        {content}
      </h2>
    </div>
  );
}

export default Pollsheading;
