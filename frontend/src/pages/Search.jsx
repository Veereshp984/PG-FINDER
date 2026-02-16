import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPGs } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";

const Search = () => {
  const [filters, setFilters] = useState({
    sharing: "",
    minPrice: "",
    maxPrice: "",
    gender: "",
    city: "",
    rating: "",
    q: ""
  });

  const { data: pgs = [], isLoading, error } = useQuery({
    queryKey: ["pgs", filters],
    queryFn: () => fetchPGs(filters)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      sharing: "",
      minPrice: "",
      maxPrice: "",
      gender: "",
      city: "",
      rating: "",
      q: ""
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-800">Search PGs</h1>
        <p className="text-slate-500">Find the perfect paying guest accommodation</p>
      </header>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Search by PG name..."
            className="w-full border border-slate-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <select name="sharing" value={filters.sharing} onChange={handleChange} 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            <option value="">Sharing Type</option>
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>{value} Sharing</option>
            ))}
          </select>

          <select name="gender" value={filters.gender} onChange={handleChange} 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>

          <input name="city" value={filters.city} onChange={handleChange} placeholder="City" 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />

          <select name="rating" value={filters.rating} onChange={handleChange} 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            <option value="">Min Rating</option>
            {[4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value}+ Stars</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input name="minPrice" type="number" value={filters.minPrice} onChange={handleChange} placeholder="Min ₹" 
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            <span className="text-slate-400">-</span>
            <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleChange} placeholder="Max ₹" 
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>

          <button onClick={clearFilters} 
            className="text-sm text-slate-500 hover:text-emerald-600 underline">
            Clear filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          {isLoading ? "Loading..." : `${pgs.length} PG${pgs.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-44 bg-slate-200 rounded-t-xl"></div>
              <div className="p-4 space-y-2 bg-white rounded-b-xl border">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load PGs. Please try again.</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-emerald-600 hover:underline">
            Reload page
          </button>
        </div>
      ) : pgs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-600 font-medium">No PGs found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
          <button onClick={clearFilters} className="mt-4 text-emerald-600 hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.map((pg) => (
            <PGCard key={pg._id} pg={pg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
