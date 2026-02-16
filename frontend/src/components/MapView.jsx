const MapView = ({ lat, lng }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Default coordinates (Bangalore, India)
  const defaultLat = 12.9716;
  const defaultLng = 77.5946;
  
  const centerLat = lat || defaultLat;
  const centerLng = lng || defaultLng;
  
  // If no API key, show a placeholder
  if (!apiKey) {
    return (
      <div className="rounded-xl overflow-hidden border bg-slate-100 h-72 flex items-center justify-center">
        <div className="text-center p-6">
          <svg className="w-12 h-12 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-slate-500 text-sm">Map view requires Google Maps API key</p>
          <p className="text-slate-400 text-xs mt-1">
            Coordinates: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${centerLat},${centerLng}&zoom=15`;
  
  return (
    <div className="rounded-xl overflow-hidden border">
      <iframe
        title="PG location"
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      />
    </div>
  );
};

export default MapView;
