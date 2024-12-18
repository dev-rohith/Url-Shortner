import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapLocations = ({ AccessLocations = [] }) => {
  const defaultCenter = [51.505, -0.09];

  return (
    <div className="flex-1 h-[500px] w-full bg-dark-2 relative">
    <MapContainer 
      center={defaultCenter}
      zoom={6} 
      scrollWheelZoom={true} 
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      
      {AccessLocations?.map((location, i) => (
        location.coordinates && (
          <Marker
            position={[location.coordinates[0], location.coordinates[1]]}
            icon={defaultIcon}
            key={i}
          />
        )
      ))}
    </MapContainer>
  </div>
  
  );
};

export default MapLocations;