import { Card } from "@/components/ui/card";
import { Check, Moon, X } from "lucide-react";

const companies = {
  default: [
    { name: "Discord", users: "300M+" },
    { name: "Twitter", users: "450M+" },
    { name: "YouTube", users: "2.5B+" },
  ],
  optional: [
    { name: "Facebook", users: "2.9B+" },
    { name: "Instagram", users: "2B+" },
    { name: "LinkedIn", users: "875M+" },
  ],
  none: [
    { name: "WhatsApp", users: "2B+" },
    { name: "Pinterest", users: "450M+" },
    { name: "Snapchat", users: "750M+" },
  ],
};

export const CompanyAdoption = () => {
  return (
    <Card className="p-6 backdrop-blur-lg bg-white/90 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Default Dark Mode */}
        <div className="space-y-4 animate-fade-up">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <h3 className="font-semibold">Default Dark Mode</h3>
          </div>
          <div className="space-y-2">
            {companies.default.map((company) => (
              <div
                key={company.name}
                className="p-3 bg-green-50 rounded-lg flex justify-between items-center"
              >
                <span>{company.name}</span>
                <span className="text-sm text-gray-500">{company.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Dark Mode */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 text-blue-600">
            <Moon className="w-5 h-5" />
            <h3 className="font-semibold">Optional Dark Mode</h3>
          </div>
          <div className="space-y-2">
            {companies.optional.map((company) => (
              <div
                key={company.name}
                className="p-3 bg-blue-50 rounded-lg flex justify-between items-center"
              >
                <span>{company.name}</span>
                <span className="text-sm text-gray-500">{company.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* No Dark Mode */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 text-gray-600">
            <X className="w-5 h-5" />
            <h3 className="font-semibold">No Dark Mode</h3>
          </div>
          <div className="space-y-2">
            {companies.none.map((company) => (
              <div
                key={company.name}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <span>{company.name}</span>
                <span className="text-sm text-gray-500">{company.users}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};