import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import GuildDashboard from "./pages/GuildDashboard";
import Analytics from "./pages/analytics";
import Users from "./pages/users";
import Servers from "./pages/servers";
import Callback from "./pages/callback";
import Login from "./pages/Login";

// Shared full-page layout
function FullPageCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {children}
    </div>
  );
}

// JWT Decode type
interface DecodedUser {
  id: string;
  username: string;
  avatar: string;
}

// Extract user from token
function getUserFromToken(): DecodedUser | null {
  const token = localStorage.getItem("monika_jwt");
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedUser & { avatar: string | null }>(token);
    return {
      id: decoded.id,
      username: decoded.username,
      avatar: decoded.avatar ?? "",
    };
  } catch {
    return null;
  }
}

// Route guard
function AuthRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("monika_jwt");
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App(): React.JSX.Element {
  const user = getUserFromToken();

  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <Routes>
        {/* If user is already logged in, redirect to dashboard */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Discord OAuth callback */}
        <Route path="/callback" element={<Callback />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashboardLayout user={user!}>
                <Dashboard user={user!} />
              </DashboardLayout>
            </AuthRoute>
          }
        />

        <Route
          path="/dashboard/analytics"
          element={
            <AuthRoute>
              <DashboardLayout user={user!}>
                <Analytics user={user!} />
              </DashboardLayout>
            </AuthRoute>
          }
        />

        <Route
          path="/dashboard/users"
          element={
            <AuthRoute>
              <DashboardLayout user={user!}>
                <Users />
              </DashboardLayout>
            </AuthRoute>
          }
        />

        <Route
          path="/dashboard/servers"
          element={
            <AuthRoute>
              <DashboardLayout user={user!}>
                <Servers />
              </DashboardLayout>
            </AuthRoute>
          }
        />

        <Route
          path="/dashboard/:guildId"
          element={
            <AuthRoute>
              <DashboardLayout user={user!}>
                <GuildDashboard />
              </DashboardLayout>
            </AuthRoute>
          }
        />

        {/* Fallback 404 */}
        <Route
          path="*"
          element={
            <FullPageCenter>
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-red-500">404</h1>
                <p className="text-muted-foreground">Page not found</p>
              </div>
            </FullPageCenter>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
