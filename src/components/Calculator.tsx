import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CalculationResult {
  energySavings: number;
  costSavings: number;
  co2Reduction: number;
  treesSaved: number;
  milesNotDriven: number;
  ledHours: number;
}

export const Calculator = () => {
  const [device, setDevice] = useState("phone");
  const [screenType, setScreenType] = useState("oled");
  const [hours, setHours] = useState(4.8);
  const [apps, setApps] = useState(10);
  const [darkModePercentage, setDarkModePercentage] = useState(50);

  const calculateImpact = (): CalculationResult => {
    let baseConsumption = 0;
    let savingsRate = screenType === "oled" ? 0.43 : 0.03;

    switch (device) {
      case "phone":
        baseConsumption = 0.00066;
        break;
      case "computer":
        baseConsumption = 0.017;
        break;
      case "tv":
        baseConsumption = 0.015;
        break;
    }

    const appsWithoutDarkMode = apps * (1 - darkModePercentage / 100);
    const annualSavings = hours * 365 * baseConsumption * appsWithoutDarkMode * savingsRate;

    return {
      energySavings: annualSavings,
      costSavings: annualSavings * 0.12, // Average electricity cost per kWh
      co2Reduction: annualSavings * 0.45, // CO2 emissions per kWh
      treesSaved: (annualSavings * 0.45) / 0.06, // CO2 absorbed per tree per year
      milesNotDriven: (annualSavings * 0.45) * 2.5, // Miles per kg of CO2
      ledHours: annualSavings * 1000 / 0.01, // Hours of LED bulb usage (10W)
    };
  };

  const result = calculateImpact();

  return (
    <Card className="p-6 backdrop-blur-lg bg-white/90 shadow-lg animate-fade-up">
      <h2 className="text-2xl font-semibold mb-6">Calculate Your Impact</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="device">Device Type</Label>
            <Select
              value={device}
              onValueChange={(value) => setDevice(value)}
            >
              <option value="phone">Phone</option>
              <option value="computer">Computer</option>
              <option value="tv">TV</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="screenType">Screen Type</Label>
            <Select
              value={screenType}
              onValueChange={(value) => setScreenType(value)}
            >
              <option value="oled">OLED</option>
              <option value="lcd">LCD</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="hours">Daily Usage (hours)</Label>
          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            min={0}
            max={24}
          />
        </div>

        <div>
          <Label htmlFor="apps">Number of Apps</Label>
          <Input
            type="number"
            value={apps}
            onChange={(e) => setApps(Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="darkMode">Apps Using Dark Mode (%)</Label>
          <Input
            type="number"
            value={darkModePercentage}
            onChange={(e) => setDarkModePercentage(Number(e.target.value))}
            min={0}
            max={100}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold">Your Impact</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-600">Annual Energy Savings</p>
            <p className="text-2xl font-semibold text-primary">
              {result.energySavings.toFixed(2)} kWh
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-600">Cost Savings</p>
            <p className="text-2xl font-semibold text-primary">
              ${result.costSavings.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-600">CO₂ Reduction</p>
            <p className="text-2xl font-semibold text-primary">
              {result.co2Reduction.toFixed(2)} kg
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-600">Trees Equivalent</p>
            <p className="text-2xl font-semibold text-primary">
              {result.treesSaved.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};