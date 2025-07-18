import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/layouts/DashboardLayout";
import { fetchUsersFromBackend, UserFromAPI } from "@/lib/usersQueries";

const dummyUser = {
  id: "0",
  avatar: "null",
  username: "Admin",
};

export default function Users() {
  const [users, setUsers] = useState<UserFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark"); // Ensure dark mode is applied

    fetchUsersFromBackend()
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout user={dummyUser}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">User Manager</h2>
        <p className="text-muted-foreground text-sm">
          View and manage users who have interacted with Monika.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl bg-muted/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.username}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div><strong>XP:</strong> {user.xp}</div>
                  <div><strong>Credits:</strong> {user.credits}</div>
                  <div><strong>Red Pill:</strong> {user.redPill}</div>
                  <div><strong>Blue Pill:</strong> {user.bluePill}</div>
                  <div><strong>Warnings:</strong> {user.warnings}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
