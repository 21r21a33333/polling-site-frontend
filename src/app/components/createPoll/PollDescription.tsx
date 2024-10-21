"use client";
import { useDispatch, useSelector } from "react-redux";
import { setDescription } from "@/app/store/pollSlice";
import { RootState } from "@/app/store/store";

const PollDescription = () => {
  const description = useSelector((state: RootState) => state.poll.description);
  const dispatch = useDispatch();

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Description</label>
      <textarea
        value={description}
        onChange={(e) => dispatch(setDescription(e.target.value))}
        className="border rounded p-2 w-full"
        placeholder="Enter description"
      />
    </div>
  );
};

export default PollDescription;
