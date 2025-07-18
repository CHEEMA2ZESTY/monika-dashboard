import { apiGet } from "@/lib/api";

export type ServerData = {
  id: string;
  name: string;
  icon: string;
  features: {
    xp: boolean;
    pills: boolean;
    narration: boolean;
  };
};

export async function fetchConnectedServers(): Promise<ServerData[]> {
  return await apiGet("/api/servers");
}
