import { Card } from "@/components/ui/card";

const stats = [
  {
    title: "Global Device Count",
    value: "11.02B",
    detail: "6.92B phones, 2.3B computers, 1.8B TVs",
  },
  {
    title: "Dark Mode Adoption",
    value: "43%",
    detail: "Mobile: 55%, Computer: 40%, TV: 35%",
  },
  {
    title: "Annual Energy Savings",
    value: "63.25 TWh",
    detail: "Equivalent to powering 5.8M homes",
  },
  {
    title: "Progress to Goal",
    value: "47%",
    detail: "Target: 80% by 2026",
  },
];

export const ProgressDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="p-6 backdrop-blur-lg bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
          <p className="mt-1 text-sm text-gray-600">{stat.detail}</p>
        </Card>
      ))}
    </div>
  );
};