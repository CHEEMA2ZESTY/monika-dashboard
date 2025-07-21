import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { fetchAnalyticsStats } from "@/lib/analyticsQueries";

type AnalyticsStats = {
  totalXP: number;
  creditsPurchased: number;
  activeServers: number;
};

type AnalyticsProps = {
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
};

const Analytics: React.FC<AnalyticsProps> = ({ user }) => {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalXP: 0,
    creditsPurchased: 0,
    activeServers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAnalyticsStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load analytics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">📈 Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Data insights on XP, purchases, and server activity will appear here.
          </p>
        </div>

        {loading ? (
          <p className="text-white">Loading analytics...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total XP Earned</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Combined user XP across servers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.totalXP.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credits Purchased</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Amount users spent on credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ₦{stats.creditsPurchased.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Servers</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Servers Monika is currently active in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.activeServers.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
