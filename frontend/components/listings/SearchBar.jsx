"use client";

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for products, categories, or sellers..."
        className="w-full bg-white border border-border rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all shadow-sm group-hover:shadow-md"
      />
    </div>
  );
}
