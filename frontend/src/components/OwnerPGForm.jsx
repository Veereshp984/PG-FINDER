import { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genderAllowed: z.enum(["male", "female", "unisex"]),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  lat: z.string().optional(),
  lng: z.string().optional(),
  sharingTypes: z.array(
    z.object({
      type: z.number().min(1).max(4),
      price: z.number().min(1),
      available: z.boolean()
    })
  ).min(1, "At least one sharing type is required"),
  amenities: z.array(z.string())
});

const defaultAmenities = [
  "WiFi",
  "AC",
  "TV",
  "Washing Machine",
  "Refrigerator",
  "Power Backup",
  "Security",
  "Housekeeping",
  "Parking",
  "Gym",
  "Food",
  "Hot Water"
];

const OwnerPGForm = ({ defaultValues, onSubmit, submitting }) => {
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState(defaultValues?.photos || []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      genderAllowed: defaultValues?.genderAllowed || "unisex",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      lat: defaultValues?.lat || "",
      lng: defaultValues?.lng || "",
      sharingTypes: defaultValues?.sharingTypes || [{ type: 1, price: 5000, available: true }],
      amenities: defaultValues?.amenities || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sharingTypes"
  });

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviewUrls(urls);
  };

  const handleFormSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("genderAllowed", values.genderAllowed);
    formData.append(
      "location",
      JSON.stringify({
        address: values.address,
        city: values.city,
        coordinates: {
          lat: values.lat ? parseFloat(values.lat) : null,
          lng: values.lng ? parseFloat(values.lng) : null
        }
      })
    );
    formData.append("sharingTypes", JSON.stringify(values.sharingTypes));
    formData.append("amenities", JSON.stringify(values.amenities));

    photoFiles.forEach((file) => {
      formData.append("photos", file);
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Basic Information</h3>
        <div>
          <label className="block text-sm font-medium mb-1">PG Title</label>
          <input
            {...register("title")}
            placeholder="e.g., Sunshine PG for Girls"
            className="border rounded-lg px-3 py-2 w-full"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Describe your PG, nearby landmarks, rules, etc."
            className="border rounded-lg px-3 py-2 w-full"
            rows="4"
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender Allowed</label>
          <select {...register("genderAllowed")} className="border rounded-lg px-3 py-2 w-full">
            <option value="male">Male only</option>
            <option value="female">Female only</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Location</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input {...register("address")} placeholder="Street address" className="border rounded-lg px-3 py-2 w-full" />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input {...register("city")} placeholder="City name" className="border rounded-lg px-3 py-2 w-full" />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude (optional)</label>
            <input {...register("lat")} placeholder="e.g., 12.9716" className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude (optional)</label>
            <input {...register("lng")} placeholder="e.g., 77.5946" className="border rounded-lg px-3 py-2 w-full" />
          </div>
        </div>
      </div>

      {/* Sharing Types */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Room Types & Pricing</h3>
          <button
            type="button"
            onClick={() => append({ type: 1, price: 5000, available: true })}
            className="text-sm text-emerald-600 font-medium"
            disabled={fields.length >= 4}
          >
            + Add Room Type
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid md:grid-cols-4 gap-3 items-end border-b pb-4 last:border-0">
            <div>
              <label className="block text-sm font-medium mb-1">Sharing</label>
              <select {...register(`sharingTypes.${index}.type`)} className="border rounded-lg px-3 py-2 w-full">
                <option value={1}>1 Sharing</option>
                <option value={2}>2 Sharing</option>
                <option value={3}>3 Sharing</option>
                <option value={4}>4 Sharing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹/month)</label>
              <input
                type="number"
                {...register(`sharingTypes.${index}.price`, { valueAsNumber: true })}
                placeholder="5000"
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select {...register(`sharingTypes.${index}.available`)} className="border rounded-lg px-3 py-2 w-full">
                <option value={true}>Available</option>
                <option value={false}>Full</option>
              </select>
            </div>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-red-500 py-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.sharingTypes && <p className="text-sm text-red-500">{errors.sharingTypes.message}</p>}
      </div>

      {/* Amenities */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {defaultAmenities.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("amenities")} value={amenity} className="rounded" />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Photos</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />
        <p className="text-xs text-slate-500">Upload up to 10 photos of your PG</p>

        {photoPreviewUrls.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {photoPreviewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full md:w-auto"
      >
        {submitting ? "Saving..." : "Save PG Listing"}
      </button>
    </form>
  );
};

export default OwnerPGForm;
