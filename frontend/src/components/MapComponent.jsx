// MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Children, useEffect, useState } from 'react';

const MapComponent = ({ position = {lat: 23.207594, lng: 87.027532}, zoom = 16, children }) => {
  return (
    <>
        <MapContainer className='map' center={[position.lat, position.lng]} zoom={zoom} style={{height: '100%', width: '100%'}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {children}
        </MapContainer>
    </>
  );
};

export default MapComponent;
