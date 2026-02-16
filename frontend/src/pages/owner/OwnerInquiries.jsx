import { useQuery } from "@tanstack/react-query";
import { fetchInquiries } from "../../api/owner.js";

const OwnerInquiries = () => {
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["owner-inquiries"],
    queryFn: fetchInquiries
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inquiries</h1>
        <p className="text-slate-500">Contact requests from interested tenants</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-slate-50 border rounded-xl p-8 text-center">
          <p className="text-slate-500">No inquiries yet.</p>
          <p className="text-sm text-slate-400 mt-1">Interested tenants will appear here when they contact you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white border rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-lg">{inquiry.name}</p>
                  <p className="text-emerald-600 font-medium">{inquiry.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              {inquiry.pgId && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">For PG</p>
                  <p className="font-medium text-slate-800">{inquiry.pgId.title}</p>
                  <p className="text-sm text-slate-500">{inquiry.pgId.location?.city}</p>
                </div>
              )}
              {inquiry.message && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Message</p>
                  <p className="text-slate-600 bg-slate-50 rounded-lg p-3">{inquiry.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerInquiries;
