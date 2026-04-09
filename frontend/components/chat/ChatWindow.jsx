"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  X, 
  Send, 
  User, 
  Building2, 
  Package, 
  MoreVertical,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { request as apiRequest } from "@/lib/api";

/**
 * @param {Object} props
 * @param {Object} props.request - The request object this chat is linked to
 * @param {Object} props.currentUser - The logged-in user
 * @param {Function} props.onClose - Function to close the chat
 */
export default function ChatWindow({ request, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Robust data extraction with ID normalization
  const isBuyer = useMemo(() => {
    return currentUser?.role === 'customer' || currentUser?.role === 'buyer';
  }, [currentUser]);

  const otherParty = useMemo(() => {
    return isBuyer ? request.sellerId : request.buyerId;
  }, [isBuyer, request]);

  const otherPartyName = useMemo(() => {
    if (!otherParty) return "Partner";
    return otherParty.organizationName || 
           `${otherParty.firstName || ""} ${otherParty.lastName || ""}`.trim() || 
           otherParty.email || 
           "Partner";
  }, [otherParty]);

  const productName = useMemo(() => {
    return request.inventoryId?.productName || request.productName || "Inventory Item";
  }, [request]);

  const otherPartyId = useMemo(() => {
    // Force to string to prevent object-serialization issues during POST
    const rawId = otherParty?._id || otherParty?.id || otherParty;
    return rawId ? String(rawId) : null;
  }, [otherParty]);

  const requestId = useMemo(() => {
    const rawId = request._id || request.id;
    return rawId ? String(rawId) : null;
  }, [request]);

  const fetchMessages = async () => {
    if (!requestId) return;
    try {
      const response = await apiRequest(`/api/chat/${requestId}`);
      // The backend returns { success: true, data: [...] }
      if (response && response.success) {
        setMessages(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      if (messages.length === 0) {
        setMessages([{
          _id: "system-1",
          senderId: "system",
          text: `Conversation regarding ${productName}`,
          createdAt: new Date().toISOString(),
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!requestId || !otherPartyId) {
      setError("Chat context is missing. Please close and reopen the chat.");
      return;
    }

    setError("");
    const textToSend = newMessage;
    setNewMessage("");

    try {
      await apiRequest('/api/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          requestId,
          receiverId: otherPartyId,
          text: textToSend
        })
      });
      fetchMessages(); 
    } catch (err) {
      console.error("Chat send error:", err);
      // Capture specific backend error message if available
      const detailedError = err.message || "Failed to send message.";
      setError(detailedError);
      setNewMessage(textToSend); // Restore text so user doesn't lose it
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col h-[600px] w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 animate-fade-up ring-1 ring-black/5">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-green-700 shadow-inner">
            {isBuyer ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 leading-none mb-1 tracking-tight">{otherPartyName}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isBuyer ? "Verified Seller" : "Verified Buyer"} • Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-200 text-gray-400"
            title="Close Chat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Inquiry Context Bar */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div className="truncate">
            <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1 tracking-widest">Regarding Product</p>
            <p className="text-sm font-black text-gray-800 truncate leading-none uppercase">{productName}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-black text-green-700">₹{request.expectedPriceTotal || 0}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{request.quantityRequested || 0} Units</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide bg-gray-50/20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connecting to Server...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-[2.5rem] bg-green-50 flex items-center justify-center mb-5 rotate-3">
              <MessageSquare className="w-10 h-10 text-green-200" />
            </div>
            <h4 className="text-base font-black text-gray-900 tracking-tight mb-2">Start Direct Negotiation</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">Message the {isBuyer ? "seller" : "buyer"} to discuss logistics, quality, or final pricing.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const currentUserId = currentUser?.id || currentUser?._id;
            const isMe = String(senderId) === String(currentUserId);
            const showDate = index === 0 || 
              new Date(messages[index-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

            if (senderId === "system") {
               return (
                  <div key={msg._id || index} className="flex justify-center my-6">
                     <span className="px-4 py-1.5 rounded-full bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 shadow-sm">
                        {msg.text}
                     </span>
                  </div>
               );
            }

            return (
              <div key={msg._id || index} className="space-y-2">
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="px-4 py-1.5 rounded-full bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 italic shadow-sm">
                      {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className={cn(
                  "flex w-full animate-fade-in transition-all",
                  isMe ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[85%] px-5 py-3.5 rounded-[1.75rem] text-[15px] shadow-sm",
                    isMe 
                      ? "bg-gray-900 text-white rounded-tr-none shadow-gray-200" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none font-medium shadow-gray-100"
                  )}>
                    <p className="leading-relaxed tracking-tight">{msg.text}</p>
                    <div className={cn(
                      "flex items-center gap-1.5 mt-2",
                      isMe ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-[10px] font-bold",
                        isMe ? "text-white/50" : "text-gray-400"
                      )}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Check className="w-3.5 h-3.5 text-white/30" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-2xl flex items-center gap-3 text-xs font-bold text-red-600 uppercase tracking-widest animate-shake border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button type="button" className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-300 hover:text-gray-900 shrink-0">
            <Paperclip className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl text-[15px] focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-200 outline-none transition-all placeholder:text-gray-400 font-bold"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors">
              <Smile className="w-6 h-6" />
            </button>
          </div>
          <button 
            type="submit"
            disabled={!newMessage.trim() || !otherPartyId || !requestId}
            className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-xl shadow-gray-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100 shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
