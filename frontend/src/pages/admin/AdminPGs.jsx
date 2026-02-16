import { useQuery } from "@tanstack/react-query";
import { fetchAdminPGs } from "../../api/admin.js";

const AdminPGs = () => {
  const { data: pgs = [] } = useQuery({ queryKey: ["admin-pgs"], queryFn: fetchAdminPGs });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">All PGs</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {pgs.map((pg) => (
          <div key={pg._id} className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold">{pg.title}</h3>
            <p className="text-sm text-slate-500">{pg.location?.city}</p>
            <p className="text-sm text-slate-500">Owner: {pg.ownerId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPGs;
