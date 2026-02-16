import { useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const Map = ({ pgs, selectedPG, onMarkerClick }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const markers = useMemo(() => {
    return pgs
      .filter(pg => pg.location?.coordinates?.lat && pg.location?.coordinates?.lng)
      .map(pg => ({
        id: pg._id,
        position: {
          lat: pg.location.coordinates.lat,
          lng: pg.location.coordinates.lng,
        },
        pg,
      }));
  }, [pgs]);

  const center = useMemo(() => {
    if (selectedPG?.location?.coordinates) {
      return {
        lat: selectedPG.location.coordinates.lat,
        lng: selectedPG.location.coordinates.lng,
      };
    }
    if (markers.length > 0) {
      return markers[0].position;
    }
    return defaultCenter;
  }, [selectedPG, markers]);

  const handleMarkerClick = (marker) => {
    setActiveMarker(marker.id);
    onMarkerClick?.(marker.pg);
  };

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          onClick={() => handleMarkerClick(marker)}
          animation={selectedPG?._id === marker.id ? window.google.maps.Animation.BOUNCE : null}
        >
          {activeMarker === marker.id && (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div className="p-2 min-w-[200px]">
                <img
                  src={marker.pg.photos?.[0] || '/placeholder-pg.jpg'}
                  alt={marker.pg.title}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <h4 className="font-semibold text-sm mb-1">{marker.pg.title}</h4>
                <p className="text-xs text-gray-500 mb-2">
                  {marker.pg.location?.city}
                </p>
                <Link
                  to={`/pg/${marker.pg._id}`}
                  className="text-xs text-primary-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};

export default Map;
