const MapView = ({ lat, lng }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const defaultLat = 12.9716; // Bangalore
  const defaultLng = 77.5946;

  const centerLat = lat || defaultLat;
  const centerLng = lng || defaultLng;

  if (!apiKey) {
    return (
      <div className="rounded-xl overflow-hidden border bg-slate-50 h-72 flex items-center justify-center">
        <div className="text-center p-6">
          <span className="text-4xl">🗺️</span>
          <p className="text-slate-500 mt-2 text-sm">Map view</p>
          <p className="text-xs text-slate-400 mt-1">Coordinates: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</p>
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
