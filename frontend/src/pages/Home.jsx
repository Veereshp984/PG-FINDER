import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPGs } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";

const popularCities = [
  { name: "Bangalore", icon: "🏙️" },
  { name: "Mumbai", icon: "🌃" },
  { name: "Delhi", icon: "🕌" },
  { name: "Hyderabad", icon: "🏛️" },
  { name: "Chennai", icon: "🏖️" },
  { name: "Pune", icon: "🎓" }
];

const features = [
  { title: "Verified Listings", desc: "All PGs are verified by our team", icon: "✓" },
  { title: "Direct Contact", desc: "Connect directly with PG owners", icon: "📞" },
  { title: "Real Reviews", desc: "Read honest reviews from tenants", icon: "⭐" },
  { title: "Easy Search", desc: "Filter by price, location, amenities", icon: "🔍" }
];

const Home = () => {
  const { data: pgs = [], isLoading } = useQuery({
    queryKey: ["pgs", "featured"],
    queryFn: () => fetchPGs({})
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Find Your Perfect PG Stay
              </h1>
              <p className="text-emerald-100 text-lg">
                Browse thousands of verified PG accommodations with photos, amenities, and genuine reviews from tenants.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
                >
                  Search PGs
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  List Your PG
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-sm w-full">
              <p className="font-semibold text-lg mb-4">Why choose PG Finder?</p>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {f.icon}
                    </span>
                    <span className="text-emerald-50">{f.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6">Popular Cities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCities.map((city) => (
            <Link
              key={city.name}
              to={`/search?city=${city.name}`}
              className="bg-white border rounded-xl p-6 text-center hover:shadow-md hover:border-emerald-200 transition"
            >
              <span className="text-3xl">{city.icon}</span>
              <p className="font-medium mt-2 text-slate-700">{city.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Listings */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Latest Listings</h2>
          <Link to="/search" className="text-emerald-600 font-medium hover:underline">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <div className="h-44 bg-slate-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgs.slice(0, 6).map((pg) => (
              <PGCard key={pg._id} pg={pg} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-10">How PG Finder Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="font-semibold">Search</h3>
              <p className="text-slate-500 text-sm">Browse PGs by city, price, sharing type, and amenities</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="font-semibold">Compare</h3>
              <p className="text-slate-500 text-sm">View photos, read reviews, and compare prices</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="font-semibold">Connect</h3>
              <p className="text-slate-500 text-sm">Contact PG owners directly and book your stay</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
