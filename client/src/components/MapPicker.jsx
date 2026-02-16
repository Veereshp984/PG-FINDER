import { useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const MapPicker = ({ coordinates, onCoordinatesChange }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapClick = useCallback((e) => {
    onCoordinatesChange({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, [onCoordinatesChange]);

  const onMarkerDragEnd = useCallback((e) => {
    onCoordinatesChange({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, [onCoordinatesChange]);

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
      center={coordinates}
      zoom={14}
      onClick={onMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      <Marker
        position={coordinates}
        draggable
        onDragEnd={onMarkerDragEnd}
      />
    </GoogleMap>
  );
};

export default MapPicker;
