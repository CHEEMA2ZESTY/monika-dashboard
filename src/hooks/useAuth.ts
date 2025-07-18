// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  avatar: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.warn("🔒 Not authenticated or session expired.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
    } catch {}
    setUser(null);
  };

  return { user, loading, logout };
};
