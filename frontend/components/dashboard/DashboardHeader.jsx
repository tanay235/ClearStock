"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, LayoutGrid, Plus } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader({ isBuyer: isBuyerProp } = {}) {
  const { user } = useAuth();

  const userName = useMemo(() => {
    if (!user) return "there";
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return fullName || user.organizationName || user.email || "there";
  }, [user]);

  const resolvedIsBuyer = useMemo(() => {
    if (typeof isBuyerProp === "boolean") return isBuyerProp;
    const role = user?.role;
    return role === "buyer" || role === "customer";
  }, [isBuyerProp, user]);

  const subtitle = resolvedIsBuyer
    ? "Track your deal requests and discover inventory opportunities."
    : "Manage your inventory listings and track buyer requests.";

  return (
    <header className="flex items-start justify-between gap-4 mb-10">
      {/* Left: Welcome */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-base text-gray-500 mt-1.5 font-medium">{subtitle}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification */}
        <button
          type="button"
          onClick={() => alert("You have 3 new notifications!")}
          className="relative w-9 h-9 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
        >
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {resolvedIsBuyer ? (
          <Link href="/listings">
            <button
              type="button"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
              Browse Deals
            </button>
          </Link>
        ) : (
          <Link href="/food/add">
            <button
              type="button"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add Product
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
