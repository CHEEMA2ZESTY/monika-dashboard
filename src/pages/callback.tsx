import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark"); // Ensure dark mode is enforced

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      console.warn("No authorization code found in URL.");
      navigate("/");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // 🔁 Exchange code for session (cookie-based)
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/token`,
          { code },
          { withCredentials: true }
        );

        // ✅ Auth successful — redirect to homepage
        navigate("/home");
      } catch (err) {
        console.error("❌ Token exchange failed:", err);
        navigate("/");
      }
    };

    exchangeCodeForToken();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white space-y-6 px-4">
      <img
        src="/images/Monika.jpg"
        alt="Loading Monika"
        onError={(e) => {
          e.currentTarget.src = "/default-avatar.png"; // fallback image
        }}
        className="w-32 h-32 object-cover rounded-full shadow-lg"
      />
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 border-4 border-white border-dashed rounded-full animate-spin" />
        <p className="text-lg font-medium">Logging you in with Discord...</p>
      </div>
    </div>
  );
};

export default Callback;
