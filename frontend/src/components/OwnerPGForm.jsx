import { useState, useRef } from "react";
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
  amenities: z.string().optional()
});

const OwnerPGForm = ({ defaultValues, onSubmit, submitting }) => {
  const [sharingTypes, setSharingTypes] = useState(
    defaultValues?.sharingTypes || [{ type: 1, price: "", available: true }]
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(defaultValues?.existingPhotos || []);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      genderAllowed: defaultValues?.genderAllowed || "unisex",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      lat: defaultValues?.lat || "",
      lng: defaultValues?.lng || "",
      amenities: defaultValues?.amenities || ""
    }
  });

  const addSharingType = () => {
    const usedTypes = sharingTypes.map(s => s.type);
    const availableType = [1, 2, 3, 4].find(t => !usedTypes.includes(t));
    if (availableType) {
      setSharingTypes([...sharingTypes, { type: availableType, price: "", available: true }]);
    }
  };

  const removeSharingType = (index) => {
    setSharingTypes(sharingTypes.filter((_, i) => i !== index));
  };

  const updateSharingType = (index, field, value) => {
    const updated = [...sharingTypes];
    updated[index][field] = field === "type" ? parseInt(value) : value;
    setSharingTypes(updated);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (values) => {
    const formData = new FormData();
    
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("genderAllowed", values.genderAllowed);
    formData.append("location", JSON.stringify({
      address: values.address,
      city: values.city,
      coordinates: values.lat && values.lng ? {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng)
      } : undefined
    }));
    
    const validSharingTypes = sharingTypes
      .filter(s => s.price && !isNaN(parseFloat(s.price)))
      .map(s => ({
        type: parseInt(s.type),
        price: parseFloat(s.price),
        available: s.available
      }));
    
    formData.append("sharingTypes", JSON.stringify(validSharingTypes));
    
    const amenities = values.amenities 
      ? values.amenities.split(",").map(item => item.trim()).filter(Boolean)
      : [];
    formData.append("amenities", JSON.stringify(amenities));

    selectedFiles.forEach(file => {
      formData.append("photos", file);
    });

    onSubmit(formData);
  };

  const availableSharingTypes = [1, 2, 3, 4].filter(
    type => !sharingTypes.some(s => s.type === type)
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">PG Title</label>
          <input {...register("title")} placeholder="e.g., Sunshine PG for Girls" 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea {...register("description")} placeholder="Describe your PG, nearby landmarks, rules, etc." 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" rows="4" />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gender Allowed</label>
          <select {...register("genderAllowed")} 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Location</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input {...register("address")} placeholder="Full address" 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
          <input {...register("city")} placeholder="e.g., Bangalore" 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Latitude (optional)</label>
            <input {...register("lat")} placeholder="e.g., 12.9716" 
              className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Longitude (optional)</label>
            <input {...register("lng")} placeholder="e.g., 77.5946" 
              className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Sharing Types */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Room Sharing Options</h3>
          {availableSharingTypes.length > 0 && (
            <button
              type="button"
              onClick={addSharingType}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Add sharing type
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sharingTypes.map((sharing, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <select
                value={sharing.type}
                onChange={(e) => updateSharingType(index, "type", e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                {[1, 2, 3, 4].map(type => (
                  <option key={type} value={type}>
                    {type} Sharing
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={sharing.price}
                onChange={(e) => updateSharingType(index, "price", e.target.value)}
                placeholder="Monthly rent (₹)"
                className="border border-slate-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sharing.available}
                  onChange={(e) => updateSharingType(index, "available", e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                Available
              </label>
              {sharingTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSharingType(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Amenities</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amenities (comma separated)</label>
          <input {...register("amenities")} placeholder="WiFi, AC, TV, Washing Machine, Parking, Food, Gym, etc." 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          <p className="text-xs text-slate-500 mt-1">Separate amenities with commas</p>
        </div>
      </div>

      {/* Photos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Photos</h3>
        
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Click to upload photos</span>
              <span className="text-xs text-slate-400">You can select multiple images</span>
            </div>
          </button>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={submitting} 
          className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Saving..." : "Save PG Listing"}
        </button>
      </div>
    </form>
  );
};

export default OwnerPGForm;
