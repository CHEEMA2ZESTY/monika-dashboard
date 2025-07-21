import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { fetchConnectedServers, ServerData } from "@/lib/serversQueries";

const dummyUser = {
  id: "0",
  avatar: "null",
  username: "Admin",
};

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

export default function Servers() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");

    fetchConnectedServers()
      .then(setServers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout user={dummyUser}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">🛠️ Server Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage how Monika behaves across your connected Discord servers.
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading servers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servers.map((server) => (
              <Card key={server.id} className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">{server.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    ID: {server.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(server.features).map(([key, enabled]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-t pt-2"
                    >
                      <span>{formatKey(key)}</span>
                      <Switch checked={enabled} disabled />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
