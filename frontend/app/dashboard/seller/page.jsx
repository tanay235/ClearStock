'use client';

import DonorDashboard from "@/components/dashboard/DonorDashboard";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SellerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <DonorDashboard />
          </div>
        </main>

        <FloatingActionButton />
      </div>
    </ProtectedRoute>
  );
}

