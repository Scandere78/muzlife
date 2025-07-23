"use client";

import Dashboard from "../../components/dashboard/Dashboard";
import { AuthProvider } from "../../contexts/AuthContext";

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
