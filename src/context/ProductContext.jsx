import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { SEED_PRODUCTS } from "../assets/products";

const STORAGE_KEY = "agrilink_farmer_listings";

const ProductContext = createContext(null);

function loadListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ProductProvider({ children }) {
  const [farmerListings, setFarmerListings] = useState(loadListings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farmerListings));
    } catch {
      /* ignore */
    }
  }, [farmerListings]);

  const allProducts = useMemo(() => {
    const seed = SEED_PRODUCTS.map((p) => ({
      ...p,
      isFarmerOwned: false,
      ownerId: null,
    }));
    const farmer = farmerListings.map((p) => ({
      ...p,
      isFarmerOwned: true,
    }));
    return [...farmer, ...seed];
  }, [farmerListings]);

  const getProductById = useCallback(
    (id) => allProducts.find((p) => String(p.id) === String(id)),
    [allProducts]
  );

  const addFarmerProduct = useCallback((payload, ownerId, sellerName) => {
    const id = `farmer-${Date.now()}`;
    const row = {
      ...payload,
      id,
      sellerId: ownerId,
      ownerId,
      sellerName: sellerName || "Farmer",
      isFarmerOwned: true,
      outOfStock: Number(payload.quantityAvailable) <= 0,
    };
    setFarmerListings((prev) => [row, ...prev]);
    return row;
  }, []);

  const updateFarmerProduct = useCallback((id, patch, ownerId) => {
    setFarmerListings((prev) =>
      prev.map((p) => {
        if (String(p.id) !== String(id) || p.ownerId !== ownerId) return p;
        const next = { ...p, ...patch };
        next.outOfStock = Number(next.quantityAvailable) <= 0;
        return next;
      })
    );
  }, []);

  const deleteFarmerProduct = useCallback((id, ownerId) => {
    setFarmerListings((prev) =>
      prev.filter((p) => !(String(p.id) === String(id) && p.ownerId === ownerId))
    );
  }, []);

  const listingsForOwner = useCallback(
    (ownerId) => farmerListings.filter((p) => p.ownerId === ownerId),
    [farmerListings]
  );

  return (
    <ProductContext.Provider
      value={{
        allProducts,
        farmerListings,
        getProductById,
        addFarmerProduct,
        updateFarmerProduct,
        deleteFarmerProduct,
        listingsForOwner,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
