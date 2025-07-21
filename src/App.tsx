import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import GuildDashboard from "./pages/GuildDashboard";
import Analytics from "./pages/analytics";
import Users from "./pages/users";
import Servers from "./pages/servers";
import Callback from "./pages/callback";
import Login from "./pages/Login";
import HomePage from "./pages/Homepage";

// Shared full-page layout
function FullPageCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {children}
    </div>
  );
}

// ✅ Updated: Allow avatar to be string | null
interface DecodedUser {
  id: string;
  username: string;
  avatar: string | null;
}

// AuthRoute
function AuthRoute({
  user,
  loading,
  children,
}: {
  user: DecodedUser | null;
  loading: boolean;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <FullPageCenter>
        <p className="text-lg">Loading...</p>
      </FullPageCenter>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App(): React.JSX.Element {
  const [user, setUser] = React.useState<DecodedUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.classList.add("dark");

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user); // ✅ avatar is string | null
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <FullPageCenter>
                <p className="text-lg">Loading...</p>
              </FullPageCenter>
            ) : user ? (
              <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/home"
          element={
            <AuthRoute user={user} loading={loading}>
              <HomePage />
            </AuthRoute>
          }
        />

        <Route path="/callback" element={<Callback />} />

        <Route
          path="/dashboard"
          element={
            <AuthRoute user={user} loading={loading}>
              <DashboardLayout user={user!}>
                <Dashboard user={user!} />
              </DashboardLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <AuthRoute user={user} loading={loading}>
              <DashboardLayout user={user!}>
                <Analytics user={user!} />
              </DashboardLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <AuthRoute user={user} loading={loading}>
              <DashboardLayout user={user!}>
                <Users />
              </DashboardLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard/servers"
          element={
            <AuthRoute user={user} loading={loading}>
              <DashboardLayout user={user!}>
                <Servers />
              </DashboardLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard/:guildId"
          element={
            <AuthRoute user={user} loading={loading}>
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
