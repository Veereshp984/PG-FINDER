import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPGs } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";

const features = [
  { icon: "🔍", title: "Smart Search", desc: "Filter by sharing, price, location & more" },
  { icon: "📍", title: "Map View", desc: "Find PGs near your workplace or college" },
  { icon: "⭐", title: "Verified Reviews", desc: "Read honest reviews from real tenants" },
  { icon: "💬", title: "Direct Contact", desc: "Connect directly with PG owners" },
];

const Home = () => {
  const { data: pgs = [], isLoading } = useQuery({ 
    queryKey: ["pgs", "featured"], 
    queryFn: () => fetchPGs({}) 
  });

  return (
    <div className="space-y-16 pb-10">
      {/* Hero Section */}
      <section className="bg-emerald-600">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Find Your Perfect<br />
                <span className="text-emerald-200">PG Accommodation</span>
              </h1>
              <p className="text-emerald-100 text-lg max-w-lg">
                Browse thousands of verified PG listings with photos, amenities, and real reviews from tenants.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link to="/search" className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors text-center">
                  Start Searching
                </Link>
                <Link to="/register" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center">
                  List Your PG
                </Link>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8 text-white w-full max-w-sm">
              <p className="font-semibold text-lg mb-4">Popular Filters</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="block text-emerald-200 text-xs mb-1">Sharing</span>
                  1/2/3/4 beds
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="block text-emerald-200 text-xs mb-1">Gender</span>
                  Male/Female/Unisex
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="block text-emerald-200 text-xs mb-1">Price</span>
                  Any budget
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="block text-emerald-200 text-xs mb-1">Location</span>
                  All cities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800">{f.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Listings */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Latest Listings</h2>
            <p className="text-slate-500 mt-1">New PG accommodations added recently</p>
          </div>
          <Link to="/search" className="text-emerald-600 hover:text-emerald-700 font-medium">
            View all →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-xl"></div>
                <div className="p-4 space-y-2 bg-white rounded-b-xl border">
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : pgs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <p className="text-slate-500">No listings available yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgs.slice(0, 6).map((pg) => (
              <PGCard key={pg._id} pg={pg} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Own a PG Accommodation?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            List your property on PG Finder and reach thousands of potential tenants looking for accommodation.
          </p>
          <Link to="/register" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Register as Owner
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
