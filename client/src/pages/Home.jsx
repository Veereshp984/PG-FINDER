import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBuilding, FaStar, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { usePGs } from '../hooks/usePGs';
import PGCard from '../components/PGCard';

const features = [
  {
    icon: FaSearch,
    title: 'Easy Search',
    description: 'Find PGs by location, price, amenities, and more with our powerful search filters.'
  },
  {
    icon: FaShieldAlt,
    title: 'Verified Listings',
    description: 'All PGs are verified to ensure you get accurate information and genuine photos.'
  },
  {
    icon: FaHeadset,
    title: '24/7 Support',
    description: 'Our support team is always ready to help you find your perfect accommodation.'
  }
];

const cities = [
  { name: 'Bangalore', count: '2,500+' },
  { name: 'Mumbai', count: '1,800+' },
  { name: 'Delhi', count: '1,200+' },
  { name: 'Hyderabad', count: '900+' },
  { name: 'Chennai', count: '750+' },
  { name: 'Pune', count: '600+' },
];

const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading } = usePGs({ limit: 6 });

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const city = formData.get('city');
    navigate(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Find Your Perfect PG Accommodation
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Browse thousands of verified PG listings across India. 
              Filter by location, price, amenities, and more.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-3">
                  <FaMapMarkerAlt className="text-gray-400 w-5 h-5 mr-3" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city or locality"
                    className="flex-1 outline-none text-gray-800"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary py-3 px-8 flex items-center justify-center space-x-2">
                  <FaSearch className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <span className="text-primary-200">Popular:</span>
              {['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield'].map((area) => (
                <button
                  key={area}
                  onClick={() => navigate(`/search?search=${encodeURIComponent(area)}`)}
                  className="text-primary-100 hover:text-white underline"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Verified PGs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">20+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">4.8</div>
              <div className="text-gray-600 flex items-center justify-center">
                <FaStar className="text-yellow-400 w-5 h-5 mr-1" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured PGs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured PGs</h2>
              <p className="text-gray-600 mt-1">Handpicked accommodations for you</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-primary-600 font-medium hover:underline"
            >
              View All →
            </button>
          </div>

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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.pgs?.map((pg) => (
                <PGCard key={pg._id} pg={pg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cities Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Browse by City
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find PG accommodations in major cities across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => navigate(`/search?city=${encodeURIComponent(city.name)}`)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <FaBuilding className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-500">{city.count} PGs</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose PG Finder?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding your perfect accommodation simple, safe, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            List Your PG Today
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Are you a PG owner? Join thousands of owners who trust PG Finder to find the perfect tenants.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Get Started as Owner
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
