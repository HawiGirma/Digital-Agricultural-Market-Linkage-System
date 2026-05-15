import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatETB } from "../utils/formatCurrency";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, totalItems } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-16 dark:bg-stone-950 sm:px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-600 mb-8">Add some products to get started</p>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-emerald-900 px-8 py-3 font-semibold text-[var(--color-brand-lime)] transition hover:bg-emerald-800"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const shippingCost = 5.99;
  const tax = (totalPrice || 0) * 0.08;
  const finalTotal = (totalPrice || 0) + shippingCost + tax;

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 dark:bg-stone-950 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h2>

        <p className="text-gray-600">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-semibold text-stone-900 transition-colors hover:text-emerald-800 dark:text-stone-100 dark:hover:text-emerald-300"
                        >
                          {item.name}
                        </Link>

                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeItem(item.id);
                            } else {
                              updateQuantity(item.id, -1);
                            }
                          }}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-stone-900 dark:text-stone-100">
                          {formatETB(item.price * item.quantity)}
                        </p>

                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {formatETB(item.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue Shopping */}
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 flex items-center gap-2 font-medium text-emerald-800 hover:text-emerald-950 dark:text-emerald-400"
            >
              ← Continue Shopping
            </motion.button>
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 w-full lg:mt-[0px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-semibold">
                  {formatETB(totalPrice || 0)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span className="font-semibold">
                  {formatETB(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>

                <span className="font-semibold">{formatETB(tax || 0)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>

                  <span>{formatETB(finalTotal || 0)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 py-4 font-semibold text-[var(--color-brand-lime)] transition hover:bg-emerald-800"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
