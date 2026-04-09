'use client';

import ListingsPanel from "@/components/listings/ListingsPanel";
import Sidebar from "@/components/common/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ListingsPage() {
  return (
    <ProtectedRoute allowedRoles={['buyer', 'seller', 'customer']}>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Custom Header for Marketplace */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-[0.2em]">
                    Active Marketplace
                  </span>
               </div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tighter sm:text-5xl">
                 Wholesale <span className="text-green-600">Deals</span> Marketplace
               </h1>
               <p className="text-gray-500 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
                 Browse near-expiry inventory from verified manufacturers. Turn surplus into savings while reducing food waste.
               </p>
            </div>

            {/* Marketplace Grid & Controls */}
            <ListingsPanel />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}