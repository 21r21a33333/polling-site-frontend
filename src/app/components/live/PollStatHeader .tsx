export const PollStatHeader: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <div>
    <h1 className="text-2xl font-bold mb-4">{title} Statistics</h1>
    <p className="mb-4">{description}</p>
  </div>
);
