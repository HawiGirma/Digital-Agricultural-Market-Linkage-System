import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wheat,
  Carrot,
  Apple,
  Coffee,
  Flame,
  Beef,
  Milk,
  Droplets,
  Bean,
} from "lucide-react";
import { CATEGORIES } from "../assets/products.js";
import { useProducts } from "../context/ProductContext";

const categoryIcons = {
  Grains: Wheat,
  Vegetables: Carrot,
  Fruits: Apple,
  Coffee: Coffee,
  Spices: Flame,
  "Livestock Products": Beef,
  "Dairy Products": Milk,
  "Oil Seeds": Droplets,
  Pulses: Bean,
};

export function Categories() {
  const { allProducts } = useProducts();

  const getCategoryCount = (category) =>
    allProducts.filter((p) => p.category === category).length;

  const categories = CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center sm:text-left"
      >
        <h2 className="font-serif text-3xl font-bold text-emerald-950 dark:text-emerald-100">
          Shop by category
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Ethiopian harvests — grains, coffee, pulses, and more from regional sellers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category] || Wheat;
          const count = getCategoryCount(category);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/?category=${encodeURIComponent(category)}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full cursor-pointer rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-xl dark:border-stone-700 dark:bg-stone-900"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-lime)]/25 text-emerald-900 dark:text-[var(--color-brand-lime)]">
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                      {count} listings
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50">{category}</h3>

                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                    Browse verified {category.toLowerCase()} from across Ethiopia
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-12 rounded-3xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950 to-emerald-900 p-8 text-white shadow-xl"
      >
        <h3 className="font-serif text-2xl font-bold text-[var(--color-brand-lime)]">
          Organic & agroecology
        </h3>
        <p className="mt-2 max-w-xl text-sm text-emerald-100/90">
          Filter the market for organic-tagged listings and support soil-health practices.
        </p>
        <Link to="/?organic=true" className="mt-6 inline-block">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex rounded-full bg-[var(--color-brand-lime)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-emerald-950"
          >
            View organic listings
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}

export default Categories;
