import { createContext, useContext, useState, useEffect } from "react";

const CART_KEY = "agrilink_cart";
const FAV_KEY = "agrilink_favorites";
const ORDERS_KEY = "agrilink_orders";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => loadJson(CART_KEY, []));
  const [favoriteItems, setFavoriteItems] = useState(() => loadJson(FAV_KEY, []));
  const [orders, setOrders] = useState(() => loadJson(ORDERS_KEY, []));

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch {
      /* ignore */
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favoriteItems));
    } catch {
      /* ignore */
    }
  }, [favoriteItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  const addToCart = (product, quantity) => {
    if (!product || product.outOfStock) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const setItemQuantity = (id, quantity) => {
    const q = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: q } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const toggleFavorite = (product) => {
    setFavoriteItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const removeFavorite = (id) => {
    setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id) => favoriteItems.some((item) => item.id === id);

  /**
   * @param {object} [checkoutDetails]
   * @param {string} [checkoutDetails.customerName]
   * @param {string} [checkoutDetails.phone]
   * @param {string} [checkoutDetails.deliveryLocation]
   * @param {string} [checkoutDetails.paymentMethod]
   */
  const placeOrder = (checkoutDetails = {}) => {
    if (cartItems.length === 0) return null;

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString("en-ET", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      total: Number(total.toFixed(0)),
      status: "Processing",
      items: cartItems.map((i) => ({ ...i })),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      customerName: checkoutDetails.customerName || "",
      phone: checkoutDetails.phone || "",
      deliveryLocation: checkoutDetails.deliveryLocation || "",
      paymentMethod: checkoutDetails.paymentMethod || "Pending",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        setItemQuantity,
        removeItem,
        clearCart,
        favoriteItems,
        toggleFavorite,
        removeFavorite,
        isFavorite,
        orders,
        placeOrder,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
