"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Inbox, LayoutGrid, RefreshCw, Sparkles } from "lucide-react";

import FoodCard from "@/components/food/FoodCard";
import { getNearbyDeals } from "@/services/inventoryService";
import SearchBar from "@/components/listings/SearchBar";
import FilterBar from "@/components/listings/FilterBar";

export default function ListingsPanel() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("price_asc");

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNearbyDeals();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load marketplace listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => {
      const matchesSearch = 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === "All" || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sorting
    if (sortOrder === "price_asc") {
       result.sort((a, b) => a.listingPrice - b.listingPrice);
    } else if (sortOrder === "price_desc") {
       result.sort((a, b) => b.listingPrice - a.listingPrice);
    }

    return result;
  }, [listings, searchQuery, activeCategory, sortOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-[2rem] bg-green-50 flex items-center justify-center mb-6 animate-pulse">
           <Sparkles className="w-8 h-8 text-green-500 animate-bounce" />
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Syncing Marketplace...</h2>
        <p className="text-sm text-gray-500 mt-2">Fetching the latest wholesale deals near you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen pb-20">
      {/* Search & Filter Section */}
      <div className="space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>

      {error && (
        <div className="p-5 rounded-3xl bg-red-50 border border-red-100 text-red-700 text-sm font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchListings} className="px-4 py-1.5 bg-white rounded-xl border border-red-200 text-xs hover:bg-red-100 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Main Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-gray-900 rounded-xl">
                <LayoutGrid className="w-4 h-4 text-white" />
             </div>
             <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Available Stock ({filteredListings.length})</h2>
          </div>
          <button 
            onClick={fetchListings}
            className="p-2.5 rounded-xl border border-border bg-white text-gray-400 hover:text-gray-900 hover:shadow-md transition-all active:scale-90"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <Link 
                key={item._id} 
                href={`/listings/${item._id}`}
                className="block hover:-translate-y-2 transition-transform duration-300"
              >
                <FoodCard item={item} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border border-border border-dashed shadow-sm">
            <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-900">No deals match your search</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Try adjusting your filters or search keywords to explore more inventory.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
