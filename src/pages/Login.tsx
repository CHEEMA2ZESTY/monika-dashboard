import React from "react";

const Login = () => {
  const isDev = import.meta.env.MODE === "development";
  const redirectUri = isDev
    ? "http://localhost:5173/callback"
    : "https://monika-dashboard.vercel.app/callback";

  // Redirects to your backend which handles the full Discord OAuth flow
  const BACKEND_URL = isDev
    ? "http://localhost:8080"
    : "https://monika-discord-bot-production.up.railway.app";

  const LOGIN_URL = `${BACKEND_URL}/auth/discord?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <a
        href={LOGIN_URL}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
      >
        Login with Discord
      </a>
    </div>
  );
};

export default Login;
