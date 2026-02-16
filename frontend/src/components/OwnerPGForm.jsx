import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  genderAllowed: z.enum(["male", "female", "unisex"]),
  address: z.string().min(3),
  city: z.string().min(2),
  price: z.string().min(1),
  sharing: z.string().min(1),
  amenities: z.string().optional()
});

const OwnerPGForm = ({ defaultValues, onSubmit, submitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const handleFormSubmit = (values) => {
    const sharingTypes = [
      {
        type: Number(values.sharing),
        price: Number(values.price),
        available: true
      }
    ];
    const amenities = values.amenities ? values.amenities.split(",").map((item) => item.trim()) : [];
    onSubmit({
      title: values.title,
      description: values.description,
      genderAllowed: values.genderAllowed,
      location: { address: values.address, city: values.city },
      sharingTypes,
      amenities
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input {...register("title")} placeholder="PG title" className="border rounded-lg px-3 py-2 w-full" />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      <textarea {...register("description")} placeholder="Description" className="border rounded-lg px-3 py-2 w-full" rows="4" />
      {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      <select {...register("genderAllowed")} className="border rounded-lg px-3 py-2 w-full">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="unisex">Unisex</option>
      </select>
      <input {...register("address")} placeholder="Address" className="border rounded-lg px-3 py-2 w-full" />
      <input {...register("city")} placeholder="City" className="border rounded-lg px-3 py-2 w-full" />
      <div className="grid md:grid-cols-2 gap-3">
        <input {...register("sharing")} placeholder="Sharing type (1-4)" className="border rounded-lg px-3 py-2 w-full" />
        <input {...register("price")} placeholder="Monthly price" className="border rounded-lg px-3 py-2 w-full" />
      </div>
      <input {...register("amenities")} placeholder="Amenities (comma separated)" className="border rounded-lg px-3 py-2 w-full" />
      <button type="submit" disabled={submitting} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default OwnerPGForm;
