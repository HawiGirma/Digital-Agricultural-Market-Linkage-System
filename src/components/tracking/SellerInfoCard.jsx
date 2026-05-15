import { motion } from "framer-motion";
import { Sprout, Phone } from "lucide-react";

/**
 * @param {{ seller: { name?: string, id?: string, region?: string, phone?: string } }} props
 */
export default function SellerInfoCard({ seller }) {
  const name = seller?.name || "AgriLink partner farm";
  const region = seller?.region || "Ethiopia";
  const phone = seller?.phone || "—";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 md:p-6"
    >
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
        Seller information
      </h3>
      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
          <Sprout className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-stone-50">{name}</p>
          <p className="text-sm text-stone-500">{region}</p>
          {seller?.id && (
            <p className="mt-1 font-mono text-xs text-stone-600">ID · {seller.id}</p>
          )}
          <div className="mt-3 flex items-center gap-2 text-sm text-stone-300">
            <Phone className="h-4 w-4 text-stone-500" />
            <span>{phone}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
