import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  avatar: string;
}

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.warn("Not authenticated. Redirecting to login.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white text-center px-4">
      <img
        src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
        alt="User Avatar"
        className="w-24 h-24 rounded-full shadow-lg mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
      <p className="text-lg text-gray-300 mb-6">You're now securely logged in with Discord.</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
        >
          Go to Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
