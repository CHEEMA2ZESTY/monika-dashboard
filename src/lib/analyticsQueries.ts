import { apiGet } from "@/lib/api";

export async function fetchAnalyticsStats() {
  return await apiGet<{
    totalXP: number;
    creditsPurchased: number;
    activeServers: number;
  }>("/api/analytics");
}
