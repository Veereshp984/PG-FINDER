import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPG } from "../../api/pgs.js";
import { updatePG } from "../../api/owner.js";
import OwnerPGForm from "../../components/OwnerPGForm.jsx";

const OwnerEditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pg } = useQuery({ queryKey: ["pg", id], queryFn: () => fetchPG(id) });
  const mutation = useMutation({
    mutationFn: (payload) => updatePG(id, payload),
    onSuccess: () => navigate("/owner/dashboard")
  });

  if (!pg) {
    return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;
  }

  const defaultValues = {
    title: pg.title,
    description: pg.description,
    genderAllowed: pg.genderAllowed,
    address: pg.location?.address,
    city: pg.location?.city,
    sharing: pg.sharingTypes?.[0]?.type?.toString() || "1",
    price: pg.sharingTypes?.[0]?.price?.toString() || "",
    amenities: pg.amenities?.join(", ") || ""
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Edit PG Listing</h1>
      <OwnerPGForm defaultValues={defaultValues} onSubmit={(values) => mutation.mutate(values)} submitting={mutation.isPending} />
    </div>
  );
};

export default OwnerEditPG;
