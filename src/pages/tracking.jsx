import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  RefreshCw,
  FileDown,
  MessageCircle,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { subscribeToOrder } from "../services/ordersFirestore";
import { isFirebaseConfigured } from "../lib/firebase";
import OrderSummaryCard from "../components/tracking/OrderSummaryCard";
import TrackingStepper from "../components/tracking/TrackingStepper";
import TrackingTimeline from "../components/tracking/TrackingTimeline";
import DeliveryInfoCard from "../components/tracking/DeliveryInfoCard";
import SellerInfoCard from "../components/tracking/SellerInfoCard";
import {
  DELIVERY_STATUS,
  DEFAULT_BUYER_LOCATION,
  DEFAULT_FARMER_LOCATION,
  computeEtaIso,
  labelForDeliveryStatus,
} from "../constants/trackingConfig";

const TrackingMap = lazy(() => import("../components/tracking/TrackingMap"));

function normalizeFirestoreOrder(data) {
  if (!data) return null;
  const out = { ...data };
  if (out.createdAt?.toMillis) {
    out.createdAt = out.createdAt.toMillis();
  }
  if (out.estimatedArrival?.toDate) {
    out.estimatedArrival = out.estimatedArrival.toDate().toISOString();
  }
  return out;
}

function mergeOrders(localOrder, remote) {
  const base = { ...(localOrder || {}), ...(remote || {}) };
  if (!localOrder && !remote) return null;
  if (!base.items?.length && localOrder?.items?.length) {
    base.items = localOrder.items;
  }
  if (!base.deliveryStatus) base.deliveryStatus = DELIVERY_STATUS.PENDING;
  if (!base.farmerLocation) base.farmerLocation = { ...DEFAULT_FARMER_LOCATION };
  if (!base.buyerLocation) base.buyerLocation = { ...DEFAULT_BUYER_LOCATION };
  if (!base.trackingId) base.trackingId = base.id;
  if (!base.primarySeller && base.items?.length) {
    const first = base.items[0];
    base.primarySeller = {
      name: first.sellerName || "AgriLink Partner",
      id: first.sellerId || "",
      region: first.region,
      phone: "",
    };
  }
  if (!base.estimatedArrival) {
    const t0 = typeof base.createdAt === "number" ? base.createdAt : Date.now();
    base.estimatedArrival = computeEtaIso(t0, base.deliveryStatus);
  }
  if (!base.status) base.status = labelForDeliveryStatus(base.deliveryStatus);
  return base;
}

export default function TrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, addToCart } = useCart();
  const [remote, setRemote] = useState(null);

  const localOrder = useMemo(
    () => orders.find((o) => o.id === orderId),
    [orders, orderId]
  );

  useEffect(() => {
    if (!orderId || !isFirebaseConfigured()) return undefined;
    return subscribeToOrder(orderId, (data) => {
      setRemote(normalizeFirestoreOrder(data));
    });
  }, [orderId]);

  const order = useMemo(
    () => mergeOrders(localOrder, remote),
    [localOrder, remote]
  );

  const [waitRemote, setWaitRemote] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWaitRemote(false), 2200);
    return () => clearTimeout(t);
  }, [orderId]);

  const deliveryStatus = order?.deliveryStatus || DELIVERY_STATUS.PENDING;
  const headline = order?.status || labelForDeliveryStatus(deliveryStatus);

  const handleCopyId = async () => {
    const id = order?.trackingId || orderId;
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      /* ignore */
    }
  };

  const handleReorder = () => {
    if (!order?.items?.length) return;
    for (const line of order.items) {
      const { quantity: lineQty, ...product } = line;
      addToCart(product, lineQty);
    }
    navigate("/cart");
  };

  if (!orderId) {
    navigate("/");
    return null;
  }

  const exists = localOrder || remote;
  if (!exists && !waitRemote) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 text-center">
        <PackageSearch className="h-14 w-14 text-stone-600" />
        <h1 className="mt-4 font-serif text-2xl font-bold text-stone-100">
          Order not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-stone-400">
          This tracking link is invalid or the order was placed on another device
          without cloud sync. Check your reference or return to the marketplace.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        <p className="text-sm font-medium text-stone-400">Loading your shipment…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-[#0f1412] to-stone-950 pb-16 pt-6 text-stone-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition hover:text-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400/90">
              AgriLink logistics
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Track your delivery
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-400">
              {headline}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-stone-200 backdrop-blur-sm transition hover:bg-white/10"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy tracking ID
            </button>
            <button
              type="button"
              onClick={handleReorder}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-100 transition hover:bg-emerald-500/25"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reorder
            </button>
            <button
              type="button"
              onClick={() =>
                window.alert(
                  "Invoice PDF download will be available in a future AgriLink release (placeholder)."
                )
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-stone-200 transition hover:bg-white/10"
            >
              <FileDown className="h-3.5 w-3.5" />
              Invoice
            </button>
          </div>
        </motion.header>

        <p className="mt-4 font-mono text-sm text-emerald-200/80">
          Tracking ID · {order.trackingId || order.id}
        </p>
        {isFirebaseConfigured() && remote && (
          <p className="mt-1 text-xs text-emerald-500/80">
            Live status synced from Firebase.
          </p>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-5">
            <OrderSummaryCard order={order} />
            <TrackingTimeline currentStatus={deliveryStatus} />
            <DeliveryInfoCard
              deliveryLocation={order.deliveryLocation}
              estimatedArrival={order.estimatedArrival}
              currentStatus={headline}
            />
            <SellerInfoCard seller={order.primarySeller} />
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-center backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/90">
                Estimated arrival window
              </p>
              <p className="mt-2 text-lg font-bold text-white">
                {new Date(order.estimatedArrival).toLocaleString("en-ET", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Link
              to="/contact"
              state={{ topic: `Order ${order.trackingId || order.id}` }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-900/40 transition hover:from-emerald-500 hover:to-teal-500"
            >
              <MessageCircle className="h-4 w-4" />
              Contact seller
            </Link>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <section className="glass-card p-5 md:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                Delivery progress
              </h2>
              <div className="mt-6">
                <TrackingStepper currentStatus={deliveryStatus} />
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                Live map · OpenStreetMap
              </h2>
              <Suspense
                fallback={
                  <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-stone-900/60">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                  </div>
                }
              >
                <TrackingMap
                  farmerLocation={order.farmerLocation}
                  buyerLocation={order.buyerLocation}
                  deliveryStatus={deliveryStatus}
                  className="h-[300px] md:h-[420px]"
                />
              </Suspense>
              <p className="mt-2 text-center text-xs text-stone-500">
                Route and vehicle position reflect your current status (demo logistics).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
