import { useQuery } from "@tanstack/react-query";
import { fetchInquiries } from "../../api/owner.js";

const OwnerInquiries = () => {
  const { data: inquiries = [] } = useQuery({ queryKey: ["owner-inquiries"], queryFn: fetchInquiries });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Inquiries</h1>
      <div className="space-y-3">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="bg-white border rounded-lg p-4">
            <p className="font-semibold">{inquiry.name}</p>
            <p className="text-sm text-slate-500">{inquiry.phone}</p>
            <p className="text-sm text-slate-600">{inquiry.message}</p>
            <p className="text-xs text-slate-400">For: {inquiry.pgId?.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerInquiries;
