import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  TRACKING_STEPS,
  deliveryStatusIndex,
} from "../../constants/trackingConfig";

/**
 * Vertical timeline for small screens.
 * @param {{ currentStatus: string }} props
 */
export default function TrackingTimeline({ currentStatus }) {
  const activeIndex = deliveryStatusIndex(currentStatus);

  return (
    <div className="lg:hidden">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
        Shipment timeline
      </h3>
      <ol className="relative space-y-0 pl-1">
        <div
          className="absolute bottom-2 left-[15px] top-2 w-px bg-stone-700"
          aria-hidden
        />
        {TRACKING_STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          return (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <motion.div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    done
                      ? "border-emerald-400 bg-emerald-500/30 text-emerald-100"
                      : active
                        ? "border-amber-300 bg-amber-500/20 text-amber-100"
                        : "border-stone-600 bg-stone-900 text-stone-500"
                  }`}
                  animate={
                    active
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(251,191,36,0.45)",
                            "0 0 0 12px rgba(251,191,36,0)",
                            "0 0 0 0 rgba(251,191,36,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                </motion.div>
              </div>
              <div className="min-w-0 pt-0.5">
                <p
                  className={`text-sm font-semibold ${
                    active ? "text-emerald-100" : done ? "text-stone-200" : "text-stone-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
