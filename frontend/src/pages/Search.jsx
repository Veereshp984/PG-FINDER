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

  const { data: pgs = [], isLoading } = useQuery({
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

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Search PGs</h1>
        <p className="text-slate-500">Find the perfect paying guest accommodation</p>
      </header>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
        {/* Search bar */}
        <div className="relative">
          <input
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Search by PG name..."
            className="border rounded-lg px-4 py-3 pl-10 w-full"
          />
          <span className="absolute left-3 top-3.5 text-slate-400">🔍</span>
        </div>

        {/* Filter grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <select name="sharing" value={filters.sharing} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Sharing</option>
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>{value} Sharing</option>
            ))}
          </select>
          <input
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min price (₹)"
            type="number"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max price (₹)"
            type="number"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select name="gender" value={filters.gender} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
          <input
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="City"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select name="rating" value={filters.rating} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Any Rating</option>
            {[4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value}+ Stars</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-slate-500">{pgs.length} results found</span>
            <button onClick={clearFilters} className="text-sm text-emerald-600 font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="h-44 bg-slate-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : pgs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold text-slate-700">No PGs found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your filters or search for something else</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 text-emerald-600 font-medium">
              Clear all filters
            </button>
          )}
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
