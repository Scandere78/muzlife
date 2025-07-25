"use client";

import Dashboard from "../../components/dashboard/Dashboard";
import { AuthProvider } from "../../contexts/AuthContext";
import '../../styles/globals.css';


export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </div>
  );
}
