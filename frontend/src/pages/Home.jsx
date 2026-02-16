import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPGs } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";

const Home = () => {
  const { data: pgs = [] } = useQuery({ queryKey: ["pgs", "featured"], queryFn: () => fetchPGs({}) });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <section className="bg-emerald-600 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Find the right PG for your stay</h1>
          <p className="text-emerald-50">Browse verified listings with photos, amenities, and real reviews.</p>
          <div className="flex gap-3">
            <Link to="/search" className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold">Start Searching</Link>
            <Link to="/register" className="border border-white px-4 py-2 rounded-lg font-semibold">Join Now</Link>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 text-sm">
          <p className="font-semibold">Filters available</p>
          <ul className="mt-3 space-y-2">
            <li>Sharing: 1/2/3/4</li>
            <li>Price & rating</li>
            <li>Gender & location</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest listings</h2>
          <Link to="/search" className="text-emerald-600 text-sm">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.slice(0, 6).map((pg) => (
            <PGCard key={pg._id} pg={pg} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
