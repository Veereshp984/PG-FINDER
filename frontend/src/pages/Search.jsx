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
    rating: ""
  });

  const { data: pgs = [], isLoading } = useQuery({
    queryKey: ["pgs", filters],
    queryFn: () => fetchPGs(filters)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Search PGs</h1>
        <p className="text-slate-500">Filter by sharing, price, rating, gender, and location.</p>
      </header>

      <div className="grid md:grid-cols-6 gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <select name="sharing" value={filters.sharing} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Sharing</option>
          {[1, 2, 3, 4].map((value) => (
            <option key={value} value={value}>{value} Sharing</option>
          ))}
        </select>
        <input name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Min price" className="border rounded-lg px-3 py-2 text-sm" />
        <input name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Max price" className="border rounded-lg px-3 py-2 text-sm" />
        <select name="gender" value={filters.gender} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select>
        <input name="city" value={filters.city} onChange={handleChange} placeholder="City" className="border rounded-lg px-3 py-2 text-sm" />
        <select name="rating" value={filters.rating} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Rating</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}+</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading listings...</p>
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
