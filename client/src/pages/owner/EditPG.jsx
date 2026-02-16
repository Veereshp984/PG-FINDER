import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaUpload, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePG, useUpdatePG } from '../../hooks/usePGs';
import MapPicker from '../../components/MapPicker';

const pgSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  genderAllowed: z.enum(['male', 'female', 'unisex']),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
  }),
  isActive: z.boolean(),
});

const amenitiesList = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'ac', label: 'AC' },
  { value: 'tv', label: 'TV' },
  { value: 'fridge', label: 'Fridge' },
  { value: 'washing-machine', label: 'Washing Machine' },
  { value: 'geyser', label: 'Geyser' },
  { value: 'parking', label: 'Parking' },
  { value: 'power-backup', label: 'Power Backup' },
  { value: 'security', label: 'Security' },
  { value: 'meals', label: 'Meals' },
  { value: 'gym', label: 'Gym' },
  { value: 'lift', label: 'Lift' },
  { value: 'housekeeping', label: 'Housekeeping' },
];

const EditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pg, isLoading } = usePG(id);
  const updatePG = useUpdatePG();
  
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [sharingTypes, setSharingTypes] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 12.9716, lng: 77.5946 });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(pgSchema),
  });

  useEffect(() => {
    if (pg) {
      reset({
        title: pg.title,
        description: pg.description,
        genderAllowed: pg.genderAllowed,
        location: pg.location,
        isActive: pg.isActive,
        amenities: pg.amenities,
      });
      setExistingPhotos(pg.photos || []);
      setSharingTypes(pg.sharingTypes || []);
      if (pg.location?.coordinates) {
        setCoordinates(pg.location.coordinates);
      }
    }
  }, [pg, reset]);

  const addSharingType = () => {
    const usedTypes = sharingTypes.map(s => s.type);
    const availableType = [1, 2, 3, 4].find(t => !usedTypes.includes(t));
    if (availableType) {
      setSharingTypes([...sharingTypes, { type: availableType, price: '', available: true }]);
    }
  };

  const removeSharingType = (index) => {
    setSharingTypes(sharingTypes.filter((_, i) => i !== index));
  };

  const updateSharingType = (index, field, value) => {
    const updated = [...sharingTypes];
    updated[index][field] = value;
    setSharingTypes(updated);
  };

  const handlePhotoChange = (e) => {
    setPhotos([...photos, ...Array.from(e.target.files)]);
  };

  const removeNewPhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (photoUrl) => {
    setExistingPhotos(existingPhotos.filter(p => p !== photoUrl));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('genderAllowed', data.genderAllowed);
    formData.append('isActive', data.isActive);
    formData.append('location', JSON.stringify({
      ...data.location,
      coordinates
    }));
    formData.append('sharingTypes', JSON.stringify(sharingTypes.map(s => ({
      ...s,
      price: parseInt(s.price)
    }))));
    formData.append('amenities', JSON.stringify(data.amenities || []));
    formData.append('existingPhotos', JSON.stringify(existingPhotos));
    
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    updatePG.mutate({ id, formData }, {
      onSuccess: () => navigate('/owner/dashboard'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit PG</h1>
          <p className="text-gray-600">Update your PG listing</p>
        </div>
        <button
          onClick={() => navigate('/owner/dashboard')}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input {...register('title')} className="input" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register('description')} rows={4} className="input" />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
              <select {...register('genderAllowed')} className="input">
                <option value="unisex">Unisex</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('isActive')} className="input">
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input {...register('location.address')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input {...register('location.city')} className="input" />
            </div>
          </div>
          <div className="mt-4 h-64">
            <MapPicker
              coordinates={coordinates}
              onCoordinatesChange={setCoordinates}
            />
          </div>
        </div>

        {/* Sharing Types */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Room Types & Pricing</h2>
            {sharingTypes.length < 4 && (
              <button
                type="button"
                onClick={addSharingType}
                className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Type</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {sharingTypes.map((sharing, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sharing Type</label>
                  <select
                    value={sharing.type}
                    onChange={(e) => updateSharingType(index, 'type', parseInt(e.target.value))}
                    className="input"
                  >
                    {[1, 2, 3, 4].map(t => (
                      <option key={t} value={t}>{t} Sharing</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/month)</label>
                  <input
                    type="number"
                    value={sharing.price}
                    onChange={(e) => updateSharingType(index, 'price', e.target.value)}
                    className="input"
                    placeholder="Monthly rent"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sharing.available}
                      onChange={(e) => updateSharingType(index, 'available', e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm">Available</span>
                  </label>
                </div>
                {sharingTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSharingType(index)}
                    className="text-red-500 hover:text-red-600 pt-6"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenitiesList.map((amenity) => (
              <label key={amenity.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={amenity.value}
                  {...register('amenities')}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-gray-700">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingPhotos.map((photo, index) => (
              <div key={`existing-${index}`} className="relative aspect-square">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingPhoto(photo)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.map((photo, index) => (
              <div key={`new-${index}`} className="relative aspect-square">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`New ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeNewPhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400">
              <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add Photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/owner/dashboard')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatePG.isPending}
            className="btn-primary"
          >
            {updatePG.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPG;
