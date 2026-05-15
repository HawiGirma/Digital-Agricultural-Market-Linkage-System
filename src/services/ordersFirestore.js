import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "../lib/firebase";

const collectionId = "agrilink_orders";

/** Firestore rejects undefined field values */
function forFirestore(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function orderDocRef(orderId) {
  const db = getDb();
  if (!db) return null;
  return doc(db, collectionId, orderId);
}

/**
 * Create or replace order document (used right after checkout).
 * @param {Record<string, unknown>} order
 */
export async function persistOrderToFirestore(order) {
  const ref = orderDocRef(order.id);
  if (!ref) return { ok: false, reason: "no_firebase" };
  try {
    await setDoc(ref, {
      ...forFirestore(order),
      updatedAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (e) {
    console.error("[Firestore] persistOrder", e);
    return { ok: false, reason: "write_failed" };
  }
}

/**
 * @param {string} orderId
 * @param {string} deliveryStatus
 * @param {Record<string, unknown>} [extra]
 */
export async function updateOrderDeliveryInFirestore(
  orderId,
  deliveryStatus,
  extra = {}
) {
  const ref = orderDocRef(orderId);
  if (!ref) return { ok: false, reason: "no_firebase" };
  try {
    const patch = { deliveryStatus, updatedAt: serverTimestamp() };
    if (extra.status != null) patch.status = extra.status;
    if (extra.estimatedArrival != null) patch.estimatedArrival = extra.estimatedArrival;
    await updateDoc(ref, patch);
    return { ok: true };
  } catch (e) {
    console.error("[Firestore] updateOrderDelivery", e);
    return { ok: false, reason: "write_failed" };
  }
}

/**
 * Subscribe to live order updates (farmer/admin status changes).
 * @param {string} orderId
 * @param {(data: Record<string, unknown> | null) => void} onData
 * @returns {() => void}
 */
export function subscribeToOrder(orderId, onData) {
  const ref = orderDocRef(orderId);
  if (!ref) {
    onData(null);
    return () => {};
  }
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(snap.data());
    },
    (err) => {
      console.error("[Firestore] subscribe order", err);
      onData(null);
    }
  );
}
