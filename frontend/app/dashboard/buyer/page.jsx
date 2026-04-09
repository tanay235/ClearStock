'use client';

import ReceiverDashboard from "@/components/dashboard/ReceiverDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function BuyerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['buyer', 'customer']}>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <DashboardHeader isBuyer={true} />
            <ReceiverDashboard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

