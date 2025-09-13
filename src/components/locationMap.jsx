import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const center = { lat: 6.9271, lng: 79.8612 };

export default function LocationMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            <Marker position={center} />
        </GoogleMap>
    );
}
