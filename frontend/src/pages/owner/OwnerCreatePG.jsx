import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPG } from "../../api/owner.js";
import OwnerPGForm from "../../components/OwnerPGForm.jsx";

const OwnerCreatePG = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createPG,
    onSuccess: () => navigate("/owner/dashboard")
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Create PG Listing</h1>
      <OwnerPGForm onSubmit={(values) => mutation.mutate(values)} submitting={mutation.isPending} />
    </div>
  );
};

export default OwnerCreatePG;
