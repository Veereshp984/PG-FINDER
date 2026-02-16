import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaList } from 'react-icons/fa';
import { usePGs } from '../hooks/usePGs';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useAuth';
import SearchFilters from '../components/SearchFilters';
import PGCard from '../components/PGCard';
import Map from '../components/Map';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const { data: wishlistData } = useWishlist({ enabled: isAuthenticated });

  const { data, isLoading, error } = usePGs({
    ...filters,
    page,
    limit: 12,
  });

  useEffect(() => {
    const initialFilters = {
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      sharing: searchParams.get('sharing') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      gender: searchParams.get('gender') || '',
      minRating: searchParams.get('minRating') || '',
      amenities: searchParams.get('amenities') || '',
    };
    setFilters(initialFilters);
  }, [searchParams]);

  const handleSearch = (newFilters) => {
    setPage(1);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const wishlistSet = new Set(wishlistData?.map(pg => pg._id) || []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters Header */}
      <div className="bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchFilters onSearch={handleSearch} initialFilters={filters} />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : `${data?.pagination?.total || 0} PGs found`}
            </h1>
            {filters.city && (
              <p className="text-gray-500 text-sm mt-1">
                in {filters.city}
              </p>
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaList className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaMapMarkerAlt className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`${viewMode === 'map' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
          {/* Grid View */}
          <div className={viewMode === 'map' ? 'h-[calc(100vh-300px)] overflow-y-auto' : ''}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading PGs. Please try again.</p>
              </div>
            ) : data?.pgs?.length === 0 ? (
              <div className="text-center py-12">
                <FaMapMarkerAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PGs found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.pgs?.map((pg) => (
                    <PGCard
                      key={pg._id}
                      pg={pg}
                      isWishlisted={wishlistSet.has(pg._id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination?.pages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {page} of {data.pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                      disabled={page === data.pagination.pages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="h-[calc(100vh-300px)] sticky top-40">
              <Map pgs={data?.pgs || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
