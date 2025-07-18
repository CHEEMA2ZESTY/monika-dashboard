import { apiGet } from "@/lib/api";

export async function fetchUsersFromBackend() {
  return await apiGet<UserFromAPI[]>("/api/users");
}

export type UserFromAPI = {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  credits: number;
  redPill: number;
  bluePill: number;
  warnings: number;
};
