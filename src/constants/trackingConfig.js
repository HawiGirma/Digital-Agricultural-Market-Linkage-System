/** Centralized delivery tracking — status keys and UI metadata */

export const DELIVERY_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  TRANSIT: "transit",
  NEARBY: "nearby",
  DELIVERED: "delivered",
};

/** Ordered keys for progress (0 = placed … 5 = delivered) */
export const DELIVERY_STATUS_ORDER = [
  DELIVERY_STATUS.PENDING,
  DELIVERY_STATUS.CONFIRMED,
  DELIVERY_STATUS.PREPARING,
  DELIVERY_STATUS.TRANSIT,
  DELIVERY_STATUS.NEARBY,
  DELIVERY_STATUS.DELIVERED,
];

/** Stepper / timeline labels (luxury logistics copy) */
export const TRACKING_STEPS = [
  {
    key: DELIVERY_STATUS.PENDING,
    title: "Order Placed",
    description: "Your harvest order is logged with AgriLink logistics.",
    shortLabel: "Placed",
  },
  {
    key: DELIVERY_STATUS.CONFIRMED,
    title: "Confirmed by Farmer",
    description: "The grower has acknowledged stock and pickup window.",
    shortLabel: "Confirmed",
  },
  {
    key: DELIVERY_STATUS.PREPARING,
    title: "Preparing Shipment",
    description: "Sorting, grading, and cold-chain prep at origin.",
    shortLabel: "Preparing",
  },
  {
    key: DELIVERY_STATUS.TRANSIT,
    title: "In Transit",
    description: "En route across Ethiopia with live map updates.",
    shortLabel: "Transit",
  },
  {
    key: DELIVERY_STATUS.NEARBY,
    title: "Near Delivery",
    description: "Driver is in your delivery zone — get ready.",
    shortLabel: "Nearby",
  },
  {
    key: DELIVERY_STATUS.DELIVERED,
    title: "Delivered",
    description: "Handoff complete — enjoy your agricultural goods.",
    shortLabel: "Delivered",
  },
];

export function deliveryStatusIndex(status) {
  const i = DELIVERY_STATUS_ORDER.indexOf(status);
  return i >= 0 ? i : 0;
}

/** Truck position along route: 0 = farm, 1 = buyer */
export function deliveryRouteT(status) {
  const t = {
    [DELIVERY_STATUS.PENDING]: 0,
    [DELIVERY_STATUS.CONFIRMED]: 0.06,
    [DELIVERY_STATUS.PREPARING]: 0.14,
    [DELIVERY_STATUS.TRANSIT]: 0.52,
    [DELIVERY_STATUS.NEARBY]: 0.9,
    [DELIVERY_STATUS.DELIVERED]: 1,
  };
  return t[status] ?? 0;
}

export function interpolateLatLng(from, to, t) {
  const clamped = Math.min(1, Math.max(0, t));
  return {
    lat: from.lat + (to.lat - from.lat) * clamped,
    lng: from.lng + (to.lng - from.lng) * clamped,
  };
}

export function labelForDeliveryStatus(status) {
  const step = TRACKING_STEPS.find((s) => s.key === status);
  return step?.title ?? TRACKING_STEPS[0].title;
}

/** ETA used in UI (demo curve from placement time). */
export function computeEtaIso(createdAtMs, deliveryStatus) {
  const t0 = createdAtMs || Date.now();
  if (deliveryStatus === DELIVERY_STATUS.DELIVERED) {
    return new Date(t0).toISOString();
  }
  const idx = deliveryStatusIndex(deliveryStatus);
  const hoursLeft = Math.max(2, 44 - idx * 7);
  return new Date(t0 + hoursLeft * 3600 * 1000).toISOString();
}

/** Demo coordinates — Addis Ababa area (Ethiopia) */
export const DEFAULT_FARMER_LOCATION = { lat: 8.9806, lng: 38.7578 };
export const DEFAULT_BUYER_LOCATION = { lat: 9.0054, lng: 38.7636 };
