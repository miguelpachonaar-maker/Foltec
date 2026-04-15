import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Importa el CSS en tu archivo principal o aquí
// import 'leaflet/dist/leaflet.css';

const Localizador = () => {
  const position = [4.7110, -74.0721]; // Latitud y Longitud de ejemplo

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>

      {/* TileLayer define el proveedor de los mapas visuales */}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Opcional: Agregar un marcador */}
      <Marker position={position}>
        <Popup>
          Ubicacion central
        </Popup>
      </Marker>

    </MapContainer>
  );
};

export default Localizador;