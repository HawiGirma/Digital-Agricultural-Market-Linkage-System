import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  deliveryRouteT,
  interpolateLatLng,
} from "../../constants/trackingConfig";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const farmIcon = new L.DivIcon({
  className: "tracking-marker-wrap",
  html: `<div class="tracking-pin tracking-pin--farm" aria-hidden="true"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
});

const buyerIcon = new L.DivIcon({
  className: "tracking-marker-wrap",
  html: `<div class="tracking-pin tracking-pin--buyer" aria-hidden="true"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
});

function truckIcon() {
  return L.divIcon({
    className: "tracking-marker-wrap",
    html: `<div class="tracking-truck" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -16],
  });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!positions?.length) return;
    const b = L.latLngBounds(positions.map((p) => [p.lat, p.lng]));
    map.fitBounds(b, { padding: [36, 36], maxZoom: 13 });
  }, [map, positions]);
  return null;
}

/**
 * @param {{
 *  farmerLocation: { lat: number, lng: number },
 *  buyerLocation: { lat: number, lng: number },
 *  deliveryStatus: string,
 *  className?: string,
 * }} props
 */
export default function TrackingMap({
  farmerLocation,
  buyerLocation,
  deliveryStatus,
  className = "",
}) {
  const route = useMemo(
    () => [
      [farmerLocation.lat, farmerLocation.lng],
      [buyerLocation.lat, buyerLocation.lng],
    ],
    [farmerLocation, buyerLocation]
  );

  const t = deliveryRouteT(deliveryStatus);
  const truckPos = interpolateLatLng(farmerLocation, buyerLocation, t);

  const center = useMemo(
    () => [
      (farmerLocation.lat + buyerLocation.lat) / 2,
      (farmerLocation.lng + buyerLocation.lng) / 2,
    ],
    [farmerLocation, buyerLocation]
  );

  return (
    <div
      className={`tracking-map-shell h-full min-h-[260px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner md:min-h-[320px] ${className}`}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-full min-h-[inherit] w-full [&_.leaflet-tile-pane]:opacity-95"
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds
          positions={[farmerLocation, buyerLocation, truckPos]}
        />
        <Polyline
          positions={route}
          pathOptions={{
            color: "#34d399",
            weight: 4,
            opacity: 0.85,
            dashArray: "10 14",
            lineCap: "round",
            className: "tracking-route-anim",
          }}
        />
        <Marker
          position={[farmerLocation.lat, farmerLocation.lng]}
          icon={farmIcon}
        >
          <Popup>
            <span className="text-sm font-semibold text-stone-800">
              Farmer / origin
            </span>
          </Popup>
        </Marker>
        <Marker position={[buyerLocation.lat, buyerLocation.lng]} icon={buyerIcon}>
          <Popup>
            <span className="text-sm font-semibold text-stone-800">
              Your delivery address
            </span>
          </Popup>
        </Marker>
        <Marker
          position={[truckPos.lat, truckPos.lng]}
          icon={truckIcon()}
        >
          <Popup>
            <span className="text-sm font-semibold text-stone-800">
              Active delivery vehicle
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
