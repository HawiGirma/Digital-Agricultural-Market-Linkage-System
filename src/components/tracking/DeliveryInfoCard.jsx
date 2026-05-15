import { motion } from "framer-motion";
import { MapPin, Clock, Truck, Bell } from "lucide-react";

/**
 * @param {{
 *  deliveryLocation: string,
 *  estimatedArrival?: string,
 *  currentStatus: string,
 * }} props
 */
export default function DeliveryInfoCard({
  deliveryLocation,
  estimatedArrival,
  currentStatus,
}) {
  const etaLabel = estimatedArrival
    ? new Date(estimatedArrival).toLocaleString("en-ET", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Calculating…";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card space-y-4 p-5 md:p-6"
    >
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
        Delivery information
      </h3>
      <ul className="space-y-4">
        <li className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Drop-off
            </p>
            <p className="text-sm leading-relaxed text-stone-100">
              {deliveryLocation || "Address on file"}
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-200">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Estimated arrival
            </p>
            <p className="text-sm font-medium text-stone-100">{etaLabel}</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200">
            <Truck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Live status
            </p>
            <p className="text-sm capitalize text-stone-200">{currentStatus}</p>
          </div>
        </li>
      </ul>

      <div className="rounded-xl border border-dashed border-white/10 bg-stone-900/40 p-3">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Bell className="h-4 w-4 shrink-0 text-stone-500" />
          <span>
            Delivery notifications — SMS and push alerts will appear here once
            connected to your AgriLink channel (placeholder).
          </span>
        </div>
      </div>
    </motion.section>
  );
}
