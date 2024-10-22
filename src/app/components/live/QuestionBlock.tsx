import { PieChartComponent, PieLegend } from "./piechartComponent";

export const QuestionBlock: React.FC<{ question: any }> = ({ question }) => {
  const totalVotes = question.options.reduce(
    (total: number, option: any) => total + option.score,
    0
  );
  const pieData = question.options.map((option: any) => ({
    name: option.option_text,
    value: option.score,
    percentage: totalVotes > 0 ? (option.score / totalVotes) * 100 : 0,
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2 font-bold">
        {question.question_text}
      </h3>
      {totalVotes > 0 ? (
        <PieChartComponent pieData={pieData} />
      ) : (
        <div className="font-bold text-red-500">No votes</div>
      )}
      <PieLegend pieData={pieData} />
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};
