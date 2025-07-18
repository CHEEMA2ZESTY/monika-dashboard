// src/components/ui/AuthRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking auth (can be replaced with a spinner)
  if (loading) return null;

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
