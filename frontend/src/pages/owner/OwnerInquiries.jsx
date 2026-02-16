import { useQuery } from "@tanstack/react-query";
import { fetchInquiries } from "../../api/owner.js";
import { Link } from "react-router-dom";

const OwnerInquiries = () => {
  const { data: inquiries = [], isLoading } = useQuery({ 
    queryKey: ["owner-inquiries"], 
    queryFn: fetchInquiries 
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/owner/dashboard" className="text-slate-500 hover:text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold text-slate-800">Inquiries</h1>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-slate-600 font-medium">No inquiries yet</p>
          <p className="text-slate-400 text-sm mt-1">When users contact you, their inquiries will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-semibold">
                        {inquiry.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{inquiry.name}</p>
                      <p className="text-sm text-slate-500">{inquiry.phone}</p>
                    </div>
                  </div>
                  
                  {inquiry.message && (
                    <div className="bg-slate-50 rounded-lg p-3 mt-2">
                      <p className="text-slate-600 text-sm">{inquiry.message}</p>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-right">
                  <Link to={`/pg/${inquiry.pgId?._id}`} className="text-emerald-600 hover:underline font-medium">
                    {inquiry.pgId?.title || "Unknown PG"}
                  </Link>
                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerInquiries;
