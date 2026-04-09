"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutGrid,
  CheckCircle,
  Clock4,
  Package,
  Inbox,
  RefreshCw,
  Sparkles
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import FoodCard from "@/components/food/FoodCard";
import RequestCard from "@/components/requests/RequestCard";
import ChatWindow from "@/components/chat/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { getMyListings, deleteInventoryListing } from "@/services/inventoryService";
import { getIncomingRequests, updateRequestStatus } from "@/services/requestService";

const FILTER_OPTIONS = ["All", "Active", "Reserved", "Sold"];

export default function DonorDashboard() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChatRequest, setActiveChatRequest] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listingsData, requestsData] = await Promise.all([
        getMyListings(),
        getIncomingRequests()
      ]);
      setListings(Array.isArray(listingsData) ? listingsData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to sync with MongoDB. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredListings = listings.filter((item) => {
    if (activeFilter === "All") return true;
    const status = item.status?.toLowerCase() || "active";
    return status === activeFilter.toLowerCase();
  });

  const STATS = [
    { 
      title: "Total Listings", 
      value: listings.length, 
      icon: LayoutGrid, 
      color: "purple", 
      trend: "Your total inventory count" 
    },
    { 
      title: "Active Deals", 
      value: listings.filter(l => (l.status || "active") === "active").length, 
      icon: CheckCircle, 
      color: "green", 
      trend: "Available for sale" 
    },
    { 
      title: "Reserved", 
      value: listings.filter(l => l.status === "reserved").length, 
      icon: Clock4, 
      color: "amber", 
      trend: "Awaiting buyer pickup" 
    },
    { 
      title: "Sold", 
      value: listings.filter(l => l.status === "sold").length, 
      icon: Package, 
      color: "blue", 
      trend: "Completed liquidations" 
    },
  ];

  const handleDeleteListing = async (itemToDelete) => {
    if (typeof window !== "undefined" && window.confirm(`Are you sure you want to delete ${itemToDelete.productName}?`)) {
      try {
        await deleteInventoryListing(itemToDelete._id);
        setListings(listings.filter(item => item._id !== itemToDelete._id));
      } catch (err) {
        alert("Failed to delete listing. Please try again.");
      }
    }
  };

  const handleRequestStatusChange = async (requestId, newStatus) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      // Refresh data to reflect status changes
      fetchData();
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
        <Sparkles className="w-12 h-12 text-green-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Syncing with MongoDB...</h2>
        <p className="text-sm text-gray-500 mt-2">Fetching your latest inventory and requests.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      {/* Header */}
      <DashboardHeader />

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center justify-between text-sm font-bold">
          <span>{error}</span>
          <button onClick={fetchData} className="px-4 py-1.5 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* My Food Listings */}
      <section id="listings" className="scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tighter">My Product Listings</h2>
            <p className="text-xs text-gray-400 mt-0.5">{filteredListings.length} inventory items fetched from database</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="p-2 mr-2 text-gray-400 hover:text-gray-900 transition-colors">
               <RefreshCw className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    activeFilter === f
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <FoodCard
                key={item._id}
                item={item}
                onDelete={handleDeleteListing}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No listings found</p>
            <p className="text-xs text-gray-400 mt-1">Ready to clear some stock? Click "Add Product" above.</p>
          </div>
        )}
      </section>

      {/* Incoming Requests */}
      <section id="requests" className="pb-10 scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tighter">Buyer Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">{requests.length} active inquiries from verified wholesalers</p>
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
            {requests.filter((r) => r.status === "pending").length}
          </span>
        </div>

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {requests.map((req) => (
              <RequestCard 
                key={req._id} 
                request={req} 
                onStatusChange={handleRequestStatusChange} 
                onChat={(r) => setActiveChatRequest(r)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
             <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest italic">No incoming requests yet</p>
          </div>
        )}
      </section>

      {/* Chat Window Overlay */}
      {activeChatRequest && (
        <ChatWindow 
          request={activeChatRequest}
          currentUser={user}
          onClose={() => setActiveChatRequest(null)}
        />
      )}
    </div>
  );
}
