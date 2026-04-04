"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Plus, Search, Leaf, Home, List, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader({ isBuyer }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dashboardHref = isBuyer ? "/dashboard/buyer" : "/dashboard/seller";
  
  return (
    <header className="flex items-center justify-between py-4 border-b border-border bg-white px-8 sticky top-0 z-30 w-full shadow-sm">
      {/* Left: Logo Section */}
      <Link href={dashboardHref} className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 group-hover:scale-105 transition-transform duration-200">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            Clear<span className="text-green-600">Stock</span>
          </span>
          <p className="text-[10px] text-gray-400 -mt-0.5 font-medium tracking-tight">Inventory Liquidation Platform</p>
        </div>
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification */}
        <button onClick={() => alert("You have 3 new notifications!")} className="relative w-9 h-9 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {isBuyer ? (
          /* Buyer Specific CTA: Browse Deals */
          <Link href="/listings">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200">
              <List className="w-4 h-4" strokeWidth={2.5} />
              Browse Deals
            </button>
          </Link>
        ) : (
          /* Seller Specific CTA: Add Product */
          <Link href="/food/add">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add Product
            </button>
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className="relative ml-2">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full border-2 border-primary/10 bg-gray-50 flex items-center justify-center hover:border-primary/40 hover:bg-white transition-all overflow-hidden shadow-sm active:scale-95"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              
              <div className="absolute right-0 mt-3 w-56 bg-white border border-border rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border/60 mb-2">
                  <p className="text-xs font-semibold text-muted tracking-wider uppercase">Account</p>
                  <p className="text-sm font-bold text-dark truncate mt-0.5">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                </div>

                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors mx-2 rounded-xl"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Link>

                <Link 
                  href={dashboardHref}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors mx-2 rounded-xl"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="h-px bg-border/60 my-2 mx-4"></div>

                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors mx-2 rounded-xl group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
