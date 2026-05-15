import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Leaf, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductsCard.jsx";
import { CATEGORIES, REGIONS } from "../assets/products.js";
import { useProducts } from "../context/ProductContext";
import { useLocale } from "../context/LocaleContext";

const HomeShop = () => {
  const [searchParams] = useSearchParams();
  const { allProducts } = useProducts();
  const { t } = useLocale();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const organicParam = searchParams.get("organic");
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("All");
    }
    setOrganicOnly(organicParam === "true");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const min = priceMin === "" ? null : Number(priceMin);
    const max = priceMax === "" ? null : Number(priceMax);
    const q = search.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesRegion =
        selectedRegion === "All" || product.region === selectedRegion;
      const matchesOrganic = organicOnly ? product.organic : true;
      const matchesStock = inStockOnly ? !product.outOfStock : true;

      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.region && product.region.toLowerCase().includes(q));

      let matchesPrice = true;
      if (min !== null && !Number.isNaN(min)) matchesPrice &&= product.price >= min;
      if (max !== null && !Number.isNaN(max)) matchesPrice &&= product.price <= max;

      return (
        matchesCategory &&
        matchesRegion &&
        matchesOrganic &&
        matchesStock &&
        matchesSearch &&
        matchesPrice
      );
    });
  }, [
    allProducts,
    selectedCategory,
    selectedRegion,
    search,
    organicOnly,
    inStockOnly,
    priceMin,
    priceMax,
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] font-sans transition-colors dark:bg-stone-950">
      {/* Hero */}
      <section className="relative mx-4 mt-4 overflow-hidden rounded-[2rem] border border-stone-200/80 shadow-xl dark:border-stone-700 sm:mx-6 lg:mx-auto lg:mt-6 lg:max-w-7xl">
        <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
          <img
            src="/hero-agrilink.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/45 to-transparent" />
          <div className="relative z-10 flex min-h-[320px] flex-col justify-end px-6 pb-10 pt-24 sm:min-h-[380px] sm:px-10 lg:min-h-[420px] lg:px-14">
            <p className="font-serif text-lg italic text-white/95 sm:text-xl md:text-2xl">
              {t("hero_kicker")}
            </p>
            <h2 className="mt-1 font-sans text-4xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-brand-lime)] drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero_title")}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#market"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-brand-lime)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-emerald-950 shadow-lg transition hover:brightness-110"
              >
                {t("hero_cta")}
              </a>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t("hero_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market */}
      <div
        id="market"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
      >
        <div className="mb-8 flex flex-col gap-2 border-b border-stone-200 pb-8 dark:border-stone-800">
          <h1 className="font-serif text-2xl font-semibold text-emerald-950 dark:text-emerald-100 sm:text-3xl">
            {t("nav_market")}
          </h1>
          <p className="max-w-2xl text-sm text-stone-600 dark:text-stone-400 sm:text-base">
            {t("hero_sub")}
          </p>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder={t("search_placeholder")}
            className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-12 pr-4 text-stone-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                selectedCategory === cat
                  ? "bg-emerald-900 text-[var(--color-brand-lime)] shadow-md"
                  : "border border-stone-200 bg-white text-stone-700 hover:border-emerald-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/60 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex min-w-[10rem] flex-1 flex-col gap-1">
            <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              <MapPin className="h-3.5 w-3.5" />
              {t("filter_region")}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-emerald-500 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-1 flex-wrap gap-3 sm:gap-4">
            <div className="flex min-w-[6rem] flex-1 flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {t("filter_price_min")}
              </label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="—"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
            </div>
            <div className="flex min-w-[6rem] flex-1 flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {t("filter_price_max")}
              </label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="—"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                organicOnly
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : "border-stone-200 bg-white text-stone-700 hover:border-emerald-300 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
              }`}
            >
              <Leaf className="h-4 w-4" />
              {t("filter_organic")}
            </button>
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                inStockOnly
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : "border-stone-200 bg-white text-stone-700 hover:border-emerald-300 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
              }`}
            >
              {t("filter_in_stock")}
            </button>
          </div>
        </div>

        <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
          {filteredProducts.length} {t("products_found")}
        </p>

        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  duration: 0.25,
                  layout: { type: "spring", stiffness: 140, damping: 22 },
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeShop;
