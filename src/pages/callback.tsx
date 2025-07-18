import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      console.warn("No code found in URL.");
      navigate("/");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // 🔁 Exchange the code for tokens (access + refresh stored in cookies)
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/token`,
          { code },
          { withCredentials: true }
        );

        // 🎯 Navigate to dashboard — no need to store tokens manually
        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Token exchange failed:", err);
        navigate("/");
      }
    };

    exchangeCodeForToken();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white space-y-6">
      <img
        src="/images/Monika.jpg"
        alt="Loading Monika"
        className="w-32 h-32 object-cover rounded-full shadow-lg"
      />
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-4 border-white border-dashed rounded-full animate-spin" />
        <p className="text-lg">Logging you in with Discord...</p>
      </div>
    </div>
  );
};

export default Callback;
