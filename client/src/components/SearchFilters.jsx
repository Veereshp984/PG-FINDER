import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaTimes } from 'react-icons/fa';

const sharingOptions = [
  { value: 1, label: '1 Sharing' },
  { value: 2, label: '2 Sharing' },
  { value: 3, label: '3 Sharing' },
  { value: 4, label: '4 Sharing' },
];

const genderOptions = [
  { value: 'male', label: 'Male Only' },
  { value: 'female', label: 'Female Only' },
  { value: 'unisex', label: 'Unisex' },
];

const amenitiesOptions = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'ac', label: 'AC' },
  { value: 'tv', label: 'TV' },
  { value: 'fridge', label: 'Fridge' },
  { value: 'washing-machine', label: 'Washing Machine' },
  { value: 'geyser', label: 'Geyser' },
  { value: 'parking', label: 'Parking' },
  { value: 'power-backup', label: 'Power Backup' },
];

const SearchFilters = ({ onSearch, initialFilters = {} }) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    city: initialFilters.city || '',
    sharing: initialFilters.sharing || [],
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    gender: initialFilters.gender || '',
    minRating: initialFilters.minRating || '',
    amenities: initialFilters.amenities || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSharingToggle = (value) => {
    setFilters(prev => ({
      ...prev,
      sharing: prev.sharing.includes(value)
        ? prev.sharing.filter(v => v !== value)
        : [...prev.sharing, value]
    }));
  };

  const handleAmenityToggle = (value) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter(v => v !== value)
        : [...prev.amenities, value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...filters,
      sharing: filters.sharing.join(','),
      amenities: filters.amenities.join(','),
    });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      city: '',
      sharing: [],
      minPrice: '',
      maxPrice: '',
      gender: '',
      minRating: '',
      amenities: [],
    });
    onSearch({});
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              placeholder="Search PGs, locations..."
              value={filters.search}
              onChange={handleChange}
              className="input pl-10"
            />
          </div>
          <div className="md:w-48 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleChange}
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary md:w-auto">
            Search
          </button>
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="md:hidden btn-outline flex items-center justify-center space-x-2"
          >
            <FaFilter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Sharing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sharing Type
            </label>
            <div className="flex flex-wrap gap-2">
              {sharingOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSharingToggle(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.sharing.includes(option.value)
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (₹/month)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleChange}
                className="input text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleChange}
                className="input text-sm"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender Preference
            </label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="input text-sm"
            >
              <option value="">All</option>
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              className="input text-sm"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div className="hidden md:block pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {amenitiesOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAmenityToggle(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filters.amenities.includes(option.value)
                    ? 'bg-secondary-100 text-secondary-700 border border-secondary-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <FaTimes className="w-3 h-3" />
              <span>Clear all filters</span>
            </button>
          </div>
        )}
      </form>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Mobile filter content... */}
              <button
                onClick={handleSubmit}
                className="w-full btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
