import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { formatETB } from "../utils/formatCurrency";

export function ShoppingCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const total = cartItems.reduce(
    (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
    0
  );

  const itemCount = cartItems.reduce(
    (sum, item) => sum + (item?.quantity ?? 0),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-[var(--color-brand-cream)] shadow-2xl dark:border-stone-800 dark:bg-stone-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 p-6 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
                <div>
                  <h2 className="text-xl font-semibold">Your Cart</h2>
                  <p className="text-sm text-gray-500">{itemCount} items</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400">
                    Add some products to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 bg-gray-50 p-4 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.name}
                          </h3>

                          <p className="mb-2 text-sm text-stone-500 dark:text-stone-400">
                            {formatETB(item.price)} / {item.unit}
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  onRemoveItem(item.id);
                                } else {
                                  onUpdateQuantity(item.id, -1);
                                }
                              }}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          </button>

                          <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                            {formatETB(item.price * item.quantity)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold text-emerald-900 dark:text-[var(--color-brand-lime)]">
                    {formatETB(total)}
                  </span>
                </div>

                <Link to="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-2xl bg-emerald-900 py-3 font-semibold text-[var(--color-brand-lime)] transition hover:bg-emerald-800"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ShoppingCart;
