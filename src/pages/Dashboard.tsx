import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

type DashboardStats = {
  totalGuilds: number;
  activeUsers: number;
  creditsSpent: number;
};

interface DashboardProps {
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalGuilds: 0,
    activeUsers: 0,
    creditsSpent: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/stats/overview`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) fetchDashboardStats();
  }, [user]);

  if (!user) {
    return <p className="text-center text-white">Loading dashboard...</p>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome, {user.username ?? "User"} 👋
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Here's your Monika dashboard overview.
            </p>
          </div>
          <Avatar className="w-12 h-12 ring-2 ring-primary">
            <AvatarImage
              src={
                user.avatar
                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                  : undefined
              }
              alt={user.username ?? "User"}
            />
            <AvatarFallback>
              {(user.username?.slice(0, 2) ?? "UU").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Servers Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loadingStats ? "..." : stats.totalGuilds}
              </p>
              <p className="text-sm text-muted-foreground">active guilds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loadingStats ? "..." : stats.activeUsers}
              </p>
              <p className="text-sm text-muted-foreground">
                unique users this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credits Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loadingStats
                  ? "..."
                  : `₦${stats.creditsSpent.toLocaleString()}`}
              </p>
              <p className="text-sm text-muted-foreground">total this month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
