import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Minus,
  Plus,
  ShoppingCart,
  MapPin,
  User,
} from "lucide-react";
import ProductCard from "../components/ProductsCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { formatETB } from "../utils/formatCurrency";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { getProductById, allProducts } = useProducts();

  const product = getProductById(productId);
  const isOutOfStock = Boolean(product?.outOfStock);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart(product, quantity);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
          Product not found
        </h2>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Back to market
        </button>
      </div>
    );
  }

  const subtotal = product.price * quantity;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group mb-6 flex items-center text-sm font-medium text-stone-500 transition hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-300"
      >
        <ArrowLeft
          size={16}
          className="mr-2 transition-transform group-hover:-translate-x-1"
        />
        Back
      </button>

      <div className="mb-16 grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div
          className={`relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 ${
            isOutOfStock ? "opacity-70 grayscale" : ""
          }`}
        >
          <img
            src={product.image}
            alt=""
            className="mx-auto max-h-[360px] w-full rounded-2xl object-contain"
          />
          {isOutOfStock && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-900/85 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
              Out of stock
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            {product.category}
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              {formatETB(product.price)}
            </span>
            <span className="text-sm text-stone-500 dark:text-stone-400">/ {product.unit}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              {product.region}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              {product.sellerName}
            </span>
          </div>

          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              isOutOfStock
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
            }`}
          >
            {isOutOfStock ? <X size={12} /> : <Check size={12} />}
            {isOutOfStock ? "Unavailable" : "In stock"}
            {product.quantityAvailable != null && !isOutOfStock && (
              <span className="text-stone-600 dark:text-stone-400">
                · {product.quantityAvailable} {product.unit}
              </span>
            )}
          </div>

          {product.organic && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              Organic certified (MVP placeholder)
            </p>
          )}

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {product.description}
          </p>

          <div
            className={`mt-8 rounded-3xl border border-stone-200 bg-[var(--color-brand-cream)]/80 p-5 dark:border-stone-700 dark:bg-stone-800/50 ${
              isOutOfStock ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wide text-stone-600 dark:text-stone-400">
                Quantity
              </span>
              <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-600 dark:bg-stone-900">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleDecrement}
                  className="border-r border-stone-100 p-2.5 text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-bold text-stone-900 dark:text-stone-100">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleIncrement}
                  className="border-l border-stone-100 p-2.5 text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-tighter text-stone-400">
                  Line total
                </span>
                <span className="text-lg font-bold text-stone-900 dark:text-stone-50">
                  {formatETB(isOutOfStock ? 0 : subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition ${
                isOutOfStock
                  ? "cursor-not-allowed bg-stone-200 text-stone-400 dark:bg-stone-700"
                  : "bg-emerald-900 text-[var(--color-brand-lime)] shadow-md hover:bg-emerald-800 active:scale-[0.99] dark:bg-emerald-700 dark:hover:bg-emerald-600"
              }`}
            >
              <ShoppingCart size={18} />
              {isOutOfStock ? "Unavailable" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-stone-200 pt-10 dark:border-stone-800">
          <h3 className="mb-6 font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Related listings
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
