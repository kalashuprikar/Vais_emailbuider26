import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, CreditCard, Target } from "lucide-react";

const statsData = [
  {
    title: "Accounts Verified",
    value: "1,234",
    icon: Users,
    color: "text-valasys-orange",
    bgColor: "bg-orange-50",
  },
  {
    title: "Available Credits",
    value: "15,048",
    icon: CreditCard,
    color: "text-valasys-blue",
    bgColor: "bg-blue-50",
  },
  {
    title: "Credits Spent",
    value: "8,129",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Success Rate",
    value: "94.2%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-valasys-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-valasys-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
