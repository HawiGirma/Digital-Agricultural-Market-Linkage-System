import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Heart, MapPin, User } from "lucide-react";
import { formatETB } from "../utils/formatCurrency";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { isLoggedIn } = useAuth();
  const favorite = isFavorite(product.id);

  const handleImageClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, quantity);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    toggleFavorite(product);
  };

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200/80 hover:shadow-xl dark:border-stone-700 dark:bg-stone-900 ${
        product.outOfStock ? "opacity-85" : ""
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <button type="button" onClick={handleImageClick} className="block h-full w-full">
          <img
            src={product.image}
            alt=""
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              product.outOfStock ? "grayscale" : ""
            }`}
          />
        </button>

        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition ${
            favorite
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-stone-500 hover:bg-[var(--color-brand-lime)]/90 hover:text-emerald-950 dark:bg-stone-900/90 dark:text-stone-300"
          }`}
          title={favorite ? "Saved" : "Save"}
        >
          <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
        </button>

        {product.organic && !product.outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-brand-lime)]">
            Organic
          </span>
        )}

        {product.outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-900 shadow">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">{product.name}</h3>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {product.category}
        </p>

        <div className="mt-3 space-y-1 text-xs text-stone-600 dark:text-stone-300">
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
            {product.region}
          </p>
          <p className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
            <span className="truncate">{product.sellerName}</span>
          </p>
          {product.quantityAvailable != null && (
            <p className="text-stone-500 dark:text-stone-400">
              Stock: {product.outOfStock ? 0 : product.quantityAvailable} {product.unit}
            </p>
          )}
        </div>

        <p className="mt-3 text-lg font-bold text-emerald-800 dark:text-[var(--color-brand-lime)]">
          {formatETB(product.price)}
          <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
            {" "}
            / {product.unit}
          </span>
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={product.outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((q) => Math.max(1, q - 1));
            }}
            className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-stone-800 transition hover:bg-stone-100 disabled:opacity-40 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center font-semibold text-stone-800 dark:text-stone-200">
            {quantity}
          </span>
          <button
            type="button"
            disabled={product.outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((q) => q + 1);
            }}
            className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-stone-800 transition hover:bg-stone-100 disabled:opacity-40 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.outOfStock}
          className={`mt-auto w-full rounded-xl py-2.5 text-sm font-bold uppercase tracking-wide text-white transition ${
            product.outOfStock
              ? "cursor-not-allowed bg-stone-300 dark:bg-stone-600"
              : "bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] dark:bg-emerald-700 dark:hover:bg-emerald-600"
          }`}
        >
          {product.outOfStock ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
