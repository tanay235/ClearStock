"use client";

import { useMemo } from "react";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Dairy & Perishables",
  "Snacks & Confectionery",
  "Beverages",
  "Staples & Grains",
  "Packaged Meals",
];

export default function FilterBar({ 
  activeCategory, 
  setActiveCategory, 
  sortOrder, 
  setSortOrder 
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar max-w-full">
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-100 rounded-2xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200",
                activeCategory === cat
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Actions */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        <button
          onClick={() => setSortOrder(sortOrder === "price_asc" ? "price_desc" : "price_asc")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          {sortOrder === "price_asc" ? "Price: Low to High" : "Price: High to Low"}
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-xs font-bold text-gray-400 cursor-not-allowed opacity-60">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          More Filters
        </button>
      </div>
    </div>
  );
}
