'use client';

import DonorDashboard from "@/components/dashboard/DonorDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Note: Metadata moved to parent layout or removed to support Client Component hooks

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const userName = user?.firstName || "Seller";

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader isBuyer={false} />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="animate-fade-in px-2 mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-base text-gray-500 mt-1.5 font-medium">
                Manage your inventory listings and track buyer requests.
              </p>
            </div>
            
            <DonorDashboard />
          </div>
        </main>

        <FloatingActionButton />
      </div>
    </ProtectedRoute>
  );
}
