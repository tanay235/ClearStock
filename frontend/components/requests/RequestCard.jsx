"use client";

import { useMemo } from "react";
import { Clock, MessageSquare, CheckCircle, XCircle, PackageCheck, MessageCircle } from "lucide-react";
import StatusBadge from "@/components/requests/StatusBadge";
import { cn } from "@/lib/utils";

/**
 * @param {Object} props
 * @param {Object} props.request - The raw request object from MongoDB
 * @param {Function} props.onStatusChange - Callback for status updates
 * @param {Function} props.onChat - Callback to open chat
 */
export default function RequestCard({ request, onStatusChange, onChat }) {
  // Robust data extraction for populated MongoDB objects
  const buyerName = useMemo(() => {
    const b = request.buyerId;
    if (!b) return "Generic Buyer";
    return b.organizationName || 
           `${b.firstName || ""} ${b.lastName || ""}`.trim() || 
           "Verified Buyer";
  }, [request]);

  const productName = useMemo(() => {
    return request.inventoryId?.productName || request.productName || "Inventory Item";
  }, [request]);

  const quantity = useMemo(() => {
    return request.quantityRequested || request.quantity || 0;
  }, [request]);

  const unit = useMemo(() => {
    return request.inventoryId?.unit || request.unit || "units";
  }, [request]);

  const pickupTime = useMemo(() => {
    return request.pickupDeliveryTime || request.pickupTime || "Not Scheduled";
  }, [request]);

  const totalPrice = useMemo(() => {
    return request.expectedPriceTotal || request.totalPrice || 0;
  }, [request]);

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 p-6 flex flex-col gap-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-4">
          {/* Buyer Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-indigo-100">
            {buyerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-gray-900 text-base tracking-tight leading-none mb-1">{buyerName}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Wholesale Buyer • Verified Account
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
           <StatusBadge status={request.status} />
           <button 
             onClick={() => onChat && onChat(request)}
             className="flex items-center gap-1.5 text-[10px] font-black text-green-600 hover:text-green-700 transition-colors uppercase tracking-[0.15em] bg-green-50/50 px-3 py-1.5 rounded-lg"
           >
              <MessageCircle className="w-3.5 h-3.5" />
              Direct Chat
           </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Inquiry Product</p>
          <p className="text-sm font-black text-gray-800 leading-tight uppercase">{productName}</p>
        </div>
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Quantity / Deal</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-gray-900">{quantity}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">{unit}</span>
          </div>
        </div>
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex items-start gap-3 col-span-1 min-h-[70px]">
          <Clock className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup Schedule</p>
            <p className="text-sm font-black text-gray-800 leading-tight">{pickupTime}</p>
          </div>
        </div>
        <div className="bg-green-50/30 rounded-2xl p-4 border border-green-100/50 flex items-start gap-3 col-span-1 min-h-[70px]">
          <div className="text-green-600 mt-0.5 font-bold text-lg leading-none shrink-0">₹</div>
          <div>
            <p className="text-[10px] font-black text-green-700/50 uppercase tracking-widest mb-1">Offer Total</p>
            <p className="text-lg font-black text-green-700 leading-none">₹{totalPrice}</p>
          </div>
        </div>
        
        {request.note && (
          <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-100/50 flex items-start gap-3 col-span-2">
            <MessageSquare className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-black text-blue-700/50 uppercase tracking-widest mb-1">Buyer Message</p>
              <p className="text-xs text-blue-800 leading-relaxed font-medium italic">"{request.note}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {request.status?.toLowerCase() === "pending" && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onStatusChange(request.id || request._id, "Accepted")}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-[11px] font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] shadow-lg shadow-gray-200"
          >
            <CheckCircle className="w-4 h-4" />
            Accept Offer
          </button>
          <button
            onClick={() => onStatusChange(request.id || request._id, "Rejected")}
            className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-100 text-[11px] font-black px-6 py-4 rounded-2xl transition-all uppercase tracking-[0.2em]"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
      {request.status?.toLowerCase() === "accepted" && (
        <button
          onClick={() => onStatusChange(request.id || request._id, "Sold")}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black text-[11px] transition-all w-full uppercase tracking-[0.25em] shadow-lg shadow-green-100"
        >
          <PackageCheck className="w-5 h-5" />
          Finalize & Mark as Sold
        </button>
      )}
      {(request.status?.toLowerCase() === "sold" || request.status?.toLowerCase() === "rejected") && (
        <div className="text-center text-[10px] font-black text-gray-300 py-2 border-t border-gray-50 uppercase tracking-[0.3em]">
          {request.status?.toLowerCase() === "sold" ? "🚀 Transaction Complete" : "🔒 Request Closed"}
        </div>
      )}
    </div>
  );
}
