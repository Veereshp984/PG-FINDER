import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPG } from "../../api/pgs.js";
import { updatePG } from "../../api/owner.js";
import OwnerPGForm from "../../components/OwnerPGForm.jsx";

const OwnerEditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pg, isLoading } = useQuery({ queryKey: ["pg", id], queryFn: () => fetchPG(id) });
  const mutation = useMutation({
    mutationFn: (payload) => updatePG(id, payload),
    onSuccess: () => navigate("/owner/dashboard")
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-slate-500">PG not found.</p>
      </div>
    );
  }

  const defaultValues = {
    title: pg.title,
    description: pg.description,
    genderAllowed: pg.genderAllowed,
    address: pg.location?.address,
    city: pg.location?.city,
    lat: pg.location?.coordinates?.lat?.toString() || "",
    lng: pg.location?.coordinates?.lng?.toString() || "",
    sharingTypes: pg.sharingTypes || [{ type: 1, price: 5000, available: true }],
    amenities: pg.amenities || [],
    photos: pg.photos || []
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Edit PG Listing</h1>
      <OwnerPGForm
        defaultValues={defaultValues}
        onSubmit={(values) => mutation.mutate(values)}
        submitting={mutation.isPending}
      />
    </div>
  );
};

export default OwnerEditPG;
