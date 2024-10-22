import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

// PieChartComponent for rendering pie chart
export const PieChartComponent: React.FC<{ pieData: any[] }> = ({
  pieData,
}) => {
  const getColor = (index: number) => {
    const colors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#FF5733",
      "#9C27B0",
    ];
    return colors[index % colors.length];
  };

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getColor(index)} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

// PieLegend component for rendering legend below the chart
export const PieLegend: React.FC<{ pieData: any[] }> = ({ pieData }) => {
  const getColor = (index: number) => {
    const colors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#FF5733",
      "#9C27B0",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mt-2">
      {pieData.map((option, index) => (
        <div key={index} className="flex items-center mb-2">
          <div
            className="w-4 h-4 mr-2"
            style={{
              backgroundColor: getColor(index),
              borderRadius: "50%",
            }}
          />
          <span>
            {option.name}: {option.value} votes ({option.percentage.toFixed(1)}
            %)
          </span>
        </div>
      ))}
    </div>
  );
};
