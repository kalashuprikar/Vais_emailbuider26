import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Target,
  Database,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface StatsCardData {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
    data: Array<{ value: number }>;
  };
  target?: {
    current: number;
    target: number;
  };
}

interface EnhancedStatsCardsProps {
  data?: {
    accountsVerified?: number;
    availableCredits?: number;
    creditsSpent?: number;
    lalsGenerated?: number;
  };
  trends?: Record<string, Array<{ value: number; changePercent: number }>>;
}

export default function EnhancedStatsCards({
  data,
  trends,
}: EnhancedStatsCardsProps) {
  const getTrendData = (key: string) => {
    if (!trends) return null;
    const trendData = trends[key] || [];
    if (trendData.length === 0) return null;

    const latest = trendData[trendData.length - 1];
    const chartData = trendData
      .slice(-10)
      .map((item) => ({ value: item.value }));

    return {
      value: latest.changePercent,
      isPositive: latest.changePercent >= 0,
      data: chartData,
    };
  };

  const statsData: StatsCardData[] = [
    {
      title: "Accounts Verified",
      value: (data?.accountsVerified ?? 0).toLocaleString(),
      icon: Users,
      color: "text-valasys-orange",
      bgColor: "bg-orange-50",
      trend: getTrendData("accountsVerified"),
      target: { current: data?.accountsVerified ?? 0, target: 1500 },
    },
    {
      title: "Available Credits",
      value: (data?.availableCredits ?? 0).toLocaleString(),
      icon: CreditCard,
      color: "text-valasys-blue",
      bgColor: "bg-blue-50",
      trend: getTrendData("availableCredits"),
      target: { current: data?.availableCredits ?? 0, target: 20000 },
    },
    {
      title: "Credits Spent",
      value: (data?.creditsSpent ?? 0).toLocaleString(),
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: getTrendData("creditsSpent"),
      target: { current: data?.creditsSpent ?? 0, target: 10000 },
    },
    {
      title: "LALs Generated",
      value: (data?.lalsGenerated ?? 0).toLocaleString(),
      icon: Database,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: getTrendData("lalsGenerated"),
      target: { current: data?.lalsGenerated ?? 0, target: 1000 },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        const progressPercentage = stat.target
          ? Math.min(100, (stat.target.current / stat.target.target) * 100)
          : 0;

        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200 group flex flex-col content-section-hover"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-valasys-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-valasys-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>

              {/* Trend indicator */}
              {stat.trend && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {stat.trend.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        stat.trend.isPositive
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {stat.trend.isPositive ? "+" : ""}
                      {stat.trend.value.toFixed(1)}%
                    </span>
                  </div>

                  {/* Mini trend chart */}
                  <div className="h-8 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stat.trend.data}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={stat.trend.isPositive ? "#10b981" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Progress bar for targets */}
              {stat.target && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-valasys-gray-500">
                    <span>Progress to goal</span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-valasys-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        progressPercentage >= 90
                          ? "bg-green-500"
                          : progressPercentage >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
