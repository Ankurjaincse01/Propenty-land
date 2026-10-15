"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (Leaflet expects image assets that don't ship with bundlers).
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

export default function LeafletMap({
  points,
  center: customCenter,
  zoom = 13,
  height = 380,
  radiusMeters,
}: {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  radiusMeters?: number;
}) {
  const center: [number, number] = customCenter
    ? customCenter
    : points.length
    ? [points[0].lat, points[0].lng]
    : [22.0574, 78.9382];

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={icon}>
            {p.label && <Popup>{p.label}</Popup>}
          </Marker>
        ))}
        {radiusMeters && points.length > 0 && (
          <Circle
            center={center}
            radius={radiusMeters}
            pathOptions={{ color: "#143628", fillColor: "#C5A059", fillOpacity: 0.12 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
