import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  TRACKING_STEPS,
  deliveryStatusIndex,
} from "../../constants/trackingConfig";

/**
 * Horizontal progress stepper (desktop-friendly).
 * @param {{ currentStatus: string }} props
 */
export default function TrackingStepper({ currentStatus }) {
  const activeIndex = deliveryStatusIndex(currentStatus);

  return (
    <div className="hidden w-full lg:block">
      <ol className="flex items-start justify-between gap-1">
        {TRACKING_STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          return (
            <li key={step.key} className="relative flex-1">
              {index < TRACKING_STEPS.length - 1 && (
                <div
                  className="absolute left-[calc(50%+14px)] top-[13px] z-0 h-0.5 w-[calc(100%-28px)] bg-stone-700/80"
                  aria-hidden
                >
                  <motion.div
                    className="h-full bg-emerald-400/90"
                    initial={false}
                    animate={{ width: done || active ? "100%" : "0%" }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                  layout
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                    done
                      ? "border-emerald-400 bg-emerald-500/30 text-emerald-100"
                      : active
                        ? "border-amber-300 bg-amber-500/25 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                        : "border-stone-600 bg-stone-900/60 text-stone-500"
                  }`}
                  animate={
                    active
                      ? { scale: [1, 1.08, 1], boxShadow: ["0 0 0 0 rgba(52,211,153,0.4)", "0 0 0 10px rgba(52,211,153,0)", "0 0 0 0 rgba(52,211,153,0)"] }
                      : {}
                  }
                  transition={
                    active
                      ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                </motion.div>
                <p
                  className={`mt-2 max-w-[100px] text-[10px] font-semibold uppercase leading-tight tracking-wide ${
                    active ? "text-emerald-200" : done ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {step.shortLabel}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
