"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList, Clock, Inbox, LayoutGrid, RefreshCw, MessageCircle } from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import FoodCard from "@/components/food/FoodCard";
import StatusBadge from "@/components/requests/StatusBadge";
import ChatWindow from "@/components/chat/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { getNearbyDeals } from "@/services/inventoryService";
import { cancelRequest, getMyRequests } from "@/services/requestService";

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase() || "pending";
}

export default function ReceiverDashboard() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyRequestId, setBusyRequestId] = useState("");
  const [activeChatRequest, setActiveChatRequest] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [dealsResult, requestsResult] = await Promise.allSettled([
      getNearbyDeals(),
      getMyRequests(),
    ]);

    if (dealsResult.status === "fulfilled") {
      setDeals(Array.isArray(dealsResult.value) ? dealsResult.value : []);
    } else {
      setDeals([]);
      setError(dealsResult.reason?.message || "Failed to load nearby deals.");
    }

    if (requestsResult.status === "fulfilled") {
      setRequests(Array.isArray(requestsResult.value) ? requestsResult.value : []);
    } else {
      setRequests([]);
      const message = requestsResult.reason?.message || "Failed to load your requests.";
      setError((prev) => (prev ? `${prev} ${message}` : message));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const pendingCount = requests.filter((r) => normalizeStatus(r.status) === "pending").length;
    const acceptedCount = requests.filter((r) => normalizeStatus(r.status) === "accepted").length;

    return [
      {
        title: "Nearby Deals",
        value: deals.length,
        icon: LayoutGrid,
        color: "green",
        trend: "Active listings available now",
      },
      {
        title: "My Requests",
        value: requests.length,
        icon: ClipboardList,
        color: "purple",
        trend: `${pendingCount} pending • ${acceptedCount} accepted`,
      },
      {
        title: "Pending",
        value: pendingCount,
        icon: Clock,
        color: "amber",
        trend: "Awaiting seller response",
      },
    ];
  }, [deals.length, requests]);

  const handleCancelRequest = async (requestId) => {
    setBusyRequestId(requestId);
    setError("");
    try {
      const updated = await cancelRequest(requestId);
      setRequests((prev) =>
        prev.map((r) => (String(r._id) === String(requestId) ? updated : r))
      );
    } catch (err) {
      setError(err.message || "Failed to cancel request.");
    } finally {
      setBusyRequestId("");
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500 animate-pulse">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Stats */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>
      </section>

      {/* Nearby Deals */}
      <section id="deals" className="scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nearby Deals</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {deals.length} listings available
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {deals.map((item) => (
              <Link
                key={item._id || item.id}
                href={`/listings/${item._id || item.id}`}
                className="block"
              >
                <FoodCard item={item} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-border">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No deals found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try refreshing or check back later.
            </p>
          </div>
        )}
      </section>

      {/* My Requests */}
      <section id="requests" className="pb-10 scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase">My Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Track the purchase requests you’ve sent
            </p>
          </div>
          <span className="flex h-6 min-w-6 px-2 items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
            {requests.length}
          </span>
        </div>

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {requests.map((req) => {
              const status = normalizeStatus(req.status);
              const listingId = req.inventoryId?._id || req.inventoryId;
              const productName = req.inventoryId?.productName || "Listing";
              const sellerName =
                req.sellerId?.organizationName ||
                `${req.sellerId?.firstName || ""} ${req.sellerId?.lastName || ""}`.trim() ||
                "Seller";

              return (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900 text-sm tracking-tight">{productName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        Seller • {sellerName}
                      </p>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Quantity
                      </p>
                      <p className="text-sm font-black text-gray-800">
                        {req.quantityRequested} {req.unit || "units"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Total Price
                      </p>
                      <p className="text-sm font-black text-gray-800">
                        ₹{req.expectedPriceTotal}
                      </p>
                    </div>
                    {req.pickupDeliveryTime && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 col-span-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Pickup / Delivery
                        </p>
                        <p className="text-sm font-black text-gray-800">
                          {req.pickupDeliveryTime}
                        </p>
                      </div>
                    )}
                    {req.note && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 col-span-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Inquiry Note
                        </p>
                        <p className="text-xs text-gray-600 leading-snug font-medium italic">"{req.note}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-4">
                      {listingId && (
                        <Link
                          href={`/listings/${listingId}`}
                          className="text-xs font-bold text-gray-400 hover:text-green-600 transition-colors uppercase tracking-widest"
                        >
                          View Details
                        </Link>
                      )}
                      <button 
                         onClick={() => setActiveChatRequest(req)}
                         className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 transition-colors uppercase tracking-widest"
                      >
                         <MessageCircle className="w-3.5 h-3.5" />
                         Chat with Seller
                      </button>
                    </div>

                    {status === "pending" && (
                      <button
                        onClick={() => handleCancelRequest(req._id)}
                        disabled={busyRequestId === req._id}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-60 disabled:cursor-wait"
                      >
                        {busyRequestId === req._id ? "Cancelling..." : "Cancel Request"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-border">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No requests yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Browse deals above and send a purchase request.
            </p>
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
