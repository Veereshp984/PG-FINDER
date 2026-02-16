import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPG } from "../../api/pgs.js";
import { updatePG, deletePG } from "../../api/owner.js";
import OwnerPGForm from "../../components/OwnerPGForm.jsx";

const OwnerEditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: pg, isLoading } = useQuery({ 
    queryKey: ["pg", id], 
    queryFn: () => fetchPG(id) 
  });
  
  const updateMutation = useMutation({
    mutationFn: (payload) => updatePG(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pg", id] });
      queryClient.invalidateQueries({ queryKey: ["owner-listings"] });
      navigate("/owner/dashboard");
    },
    onError: (error) => {
      console.error("Failed to update PG:", error);
      alert(error.response?.data?.message || "Failed to update PG listing. Please try again.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePG(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-listings"] });
      navigate("/owner/dashboard");
    },
    onError: (error) => {
      console.error("Failed to delete PG:", error);
      alert(error.response?.data?.message || "Failed to delete PG listing. Please try again.");
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-500">PG listing not found.</p>
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
    sharingTypes: pg.sharingTypes || [],
    amenities: pg.amenities?.join(", ") || "",
    existingPhotos: pg.photos || []
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this PG listing? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Edit PG Listing</h1>
          <p className="text-slate-500 mt-1">Update your paying guest accommodation details</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <OwnerPGForm 
          defaultValues={defaultValues} 
          onSubmit={(values) => updateMutation.mutate(values)} 
          submitting={updateMutation.isPending} 
        />
      </div>
    </div>
  );
};

export default OwnerEditPG;
