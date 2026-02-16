import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPG } from "../../api/owner.js";
import OwnerPGForm from "../../components/OwnerPGForm.jsx";

const OwnerCreatePG = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createPG,
    onSuccess: () => navigate("/owner/dashboard"),
    onError: (error) => {
      console.error("Failed to create PG:", error);
      alert(error.response?.data?.message || "Failed to create PG listing. Please try again.");
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Create PG Listing</h1>
        <p className="text-slate-500 mt-1">Add a new paying guest accommodation to your listings</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <OwnerPGForm 
          onSubmit={(values) => mutation.mutate(values)} 
          submitting={mutation.isPending} 
        />
      </div>
    </div>
  );
};

export default OwnerCreatePG;
