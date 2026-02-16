const MapView = ({ lat, lng }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const src = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat || 12.9716},${lng || 77.5946}&zoom=14`;
  return (
    <div className="rounded-xl overflow-hidden border">
      <iframe
        title="PG location"
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={src}
      ></iframe>
    </div>
  );
};

export default MapView;
