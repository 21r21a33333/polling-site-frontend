import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "@/app/store/pollSlice";
import { RootState } from "@/app/store/store";

const PollTitle = () => {
  const pollTitle = useSelector((state: RootState) => state.poll.title);
  const dispatch = useDispatch();

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Poll Title</label>
      <input
        type="text"
        value={pollTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
        className="border rounded p-2 w-full"
        placeholder="Enter poll title"
      />
    </div>
  );
};

export default PollTitle;
