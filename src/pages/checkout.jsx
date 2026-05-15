import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatETB } from "../utils/formatCurrency";

function Checkout() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedId, setPlacedId] = useState("");
  const navigate = useNavigate();
  const { cartItems, placeOrder } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deliveryLocation: "",
    paymentMethod: "Cash on delivery (placeholder)",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.phone.trim() || !form.deliveryLocation.trim()) {
      return;
    }
    const order = placeOrder({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      deliveryLocation: form.deliveryLocation.trim(),
      paymentMethod: form.paymentMethod,
    });
    if (order) {
      setPlacedId(order.id);
      setOrderPlaced(true);
    }
  };

  useEffect(() => {
    if (!orderPlaced) return;
    const timer = setTimeout(() => navigate(`/tracking/${placedId}`), 1600);
    return () => clearTimeout(timer);
  }, [orderPlaced, navigate, placedId]);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cartItems.length, orderPlaced, navigate]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
    0
  );
  const logisticsFee = subtotal > 2000 ? 0 : 150;
  const total = subtotal + logisticsFee;

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 dark:bg-stone-950 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-4 text-sm font-medium text-stone-500 transition hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-300"
        >
          ← Back to cart
        </button>

        <h1 className="font-serif text-3xl font-bold text-emerald-950 dark:text-emerald-100">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          Local MVP — no payment processing. Details are stored with your order mock only.
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <motion.form
            layout
            onSubmit={handleSubmit}
            className="flex-[2] space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8"
          >
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Delivery details
            </h2>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Full name
              </label>
              <input
                name="customerName"
                required
                value={form.customerName}
                onChange={handleChange}
                className="input"
                placeholder="e.g. Hirut Mengistu"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Phone (SMS / call)
              </label>
              <input
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="+251 …"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Delivery location
              </label>
              <textarea
                name="deliveryLocation"
                required
                rows={3}
                value={form.deliveryLocation}
                onChange={handleChange}
                className="input resize-none"
                placeholder="Kebele, woreda, landmark — Addis or regional town"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Payment method
              </label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="input"
              >
                <option>Cash on delivery (placeholder)</option>
                <option>Mobile money — Telebirr (placeholder)</option>
                <option>Bank transfer — receipt later (placeholder)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full rounded-2xl bg-emerald-900 py-3.5 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-lime)] shadow-md transition hover:bg-emerald-800"
            >
              Confirm order
            </motion.button>
          </motion.form>

          <div className="flex-1">
            <div className="sticky top-24 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Order summary
              </h3>
              <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <img
                      src={item.image}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-stone-900 dark:text-stone-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        ×{item.quantity} · {item.region}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-stone-800 dark:text-stone-200">
                      {formatETB(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <hr className="my-4 border-stone-200 dark:border-stone-700" />
              <div className="space-y-2 text-sm text-stone-600 dark:text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatETB(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics (mock)</span>
                  <span className="font-semibold">{formatETB(logisticsFee)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-emerald-900 dark:border-stone-700 dark:text-[var(--color-brand-lime)]">
                  <span>Total</span>
                  <span>{formatETB(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {orderPlaced && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-stone-900"
            >
              <h2 className="font-serif text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Order received
              </h2>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                Reference <span className="font-mono font-semibold">{placedId}</span>
              </p>
              <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
                Opening live tracking and map…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Checkout;
