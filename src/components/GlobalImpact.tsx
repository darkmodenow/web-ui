import { Card } from "@/components/ui/card";
import { DollarSign, Car, TreePine } from "lucide-react";

const impactData = {
  savings: {
    value: "$7.6B",
    label: "Potential Annual Savings",
    icon: DollarSign,
  },
  co2: {
    value: "28.5M",
    label: "Metric Tons CO₂ Reduction",
    icon: TreePine,
  },
  cars: {
    value: "6.2M",
    label: "Cars Removed Equivalent",
    icon: Car,
  },
};

export const GlobalImpact = () => {
  return (
    <Card className="p-6 backdrop-blur-lg bg-white/90 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(impactData).map(([key, { value, label, icon: Icon }], index) => (
          <div
            key={key}
            className="p-6 bg-primary/10 rounded-lg text-center animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-4">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
            <p className="text-gray-600">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};