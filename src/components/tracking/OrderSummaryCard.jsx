import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { formatETB } from "../../utils/formatCurrency";

/**
 * @param {{ order: Record<string, unknown> }} props
 */
export default function OrderSummaryCard({ order }) {
  const items = order.items || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass-card p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
            Order summary
          </h3>
          <p className="mt-1 font-mono text-sm text-emerald-200/90">{order.id}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-emerald-300">
          <Package className="h-5 w-5" />
        </span>
      </div>

      <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <li
            key={`${order.id}-${item.id}`}
            className="flex items-center gap-3 rounded-lg border border-white/5 bg-stone-900/40 px-3 py-2"
          >
            <img
              src={item.image}
              alt=""
              className="h-10 w-10 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-100">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">
                ×{item.quantity} · {item.region}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-emerald-200/90">
              {formatETB(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm text-stone-400">Total paid (mock)</span>
        <span className="text-lg font-bold text-[var(--color-brand-lime)]">
          {formatETB(order.total)}
        </span>
      </div>
    </motion.section>
  );
}
