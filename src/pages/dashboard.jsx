import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Sprout,
  TrendingUp,
  Users,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { CATEGORIES, REGIONS } from "../assets/products";
import { formatETB } from "../utils/formatCurrency";

const emptyForm = {
  name: "",
  category: "Grains",
  price: "",
  unit: "kg",
  quantityAvailable: "",
  region: "Oromia",
  organic: false,
  description: "",
  imageDataUrl: "",
};

function Dashboard() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
          Sign in required
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Log in as a buyer, farmer, or admin to open your dashboard.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 rounded-full bg-emerald-900 px-6 py-3 text-sm font-bold text-[var(--color-brand-lime)]"
        >
          Go to login
        </button>
      </div>
    );
  }

  const role = user?.role || "buyer";
  const { orders, favoriteItems } = useCart();
  const {
    listingsForOwner,
    addFarmerProduct,
    updateFarmerProduct,
    deleteFarmerProduct,
    allProducts,
  } = useProducts();

  if (role === "admin") {
    return <AdminView allProducts={allProducts} orders={orders} />;
  }
  if (role === "farmer") {
    return (
      <FarmerView
        user={user}
        listings={listingsForOwner(user?.email)}
        orders={orders}
        onAdd={(payload) =>
          addFarmerProduct(payload, user.email, user.fullName || user.firstName || "Farmer")
        }
        onUpdate={(id, patch) => updateFarmerProduct(id, patch, user.email)}
        onDelete={(id) => deleteFarmerProduct(id, user.email)}
      />
    );
  }
  return <BuyerView orders={orders} favoriteItems={favoriteItems} />;
}

function AdminView({ allProducts, orders }) {
  const totalUsers = 1328;
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-emerald-950 dark:text-emerald-100">
        Admin overview
      </h1>
      <p className="mt-1 text-stone-600 dark:text-stone-400">
        Mock metrics for marketplace health (no live backend).
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users (mock)" value={totalUsers} icon={Users} />
        <StatCard label="Active listings" value={allProducts.length} icon={Package} />
        <StatCard label="Orders recorded" value={orders.length} icon={TrendingUp} />
      </div>

      <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Gross order value (mock)
        </h2>
        <p className="mt-2 text-3xl font-bold text-emerald-800 dark:text-[var(--color-brand-lime)]">
          {formatETB(revenue)}
        </p>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Sum of completed mock checkouts on this device.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
    >
      <Icon className="h-8 w-8 text-emerald-800 dark:text-emerald-400" />
      <p className="mt-3 text-2xl font-bold text-stone-900 dark:text-stone-50">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </p>
    </motion.div>
  );
}

function FarmerView({ user, listings, orders, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const receivedOrders = useMemo(
    () =>
      orders.filter((o) =>
        o.items?.some(
          (i) => i.ownerId === user?.email || i.sellerId === user?.email
        )
      ),
    [orders, user?.email]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let image =
      form.imageDataUrl ||
      (editingId ? listings.find((l) => String(l.id) === String(editingId))?.image : null) ||
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop";
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      quantityAvailable: Number(form.quantityAvailable),
      region: form.region,
      organic: form.organic,
      description: form.description.trim() || "Farmer-listed product on AgriLink Ethiopia.",
      image,
    };
    if (!payload.name || Number.isNaN(payload.price) || Number.isNaN(payload.quantityAvailable)) {
      return;
    }
    if (editingId) {
      onUpdate(editingId, payload);
      setEditingId(null);
    } else {
      onAdd(payload);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      unit: p.unit,
      quantityAvailable: String(p.quantityAvailable),
      region: p.region,
      organic: !!p.organic,
      description: p.description || "",
      imageDataUrl: p.image?.startsWith("data:") ? p.image : "",
    });
    setShowForm(true);
  };

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageDataUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-950 dark:text-emerald-100">
            Farmer workspace
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            List harvests, update stock, and track mock orders that include your listings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm((s) => !s);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-lime)] shadow-md transition hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Close form" : "Add product"}
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Your listings" value={listings.length} icon={Sprout} />
        <StatCard label="Orders with your SKUs" value={receivedOrders.length} icon={Package} />
        <StatCard
          label="Live SKUs"
          value={listings.filter((l) => !l.outOfStock).length}
          icon={TrendingUp}
        />
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
        >
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {editingId ? "Edit listing" : "New listing"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              min={0}
              placeholder="Price (ETB)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="Unit (kg, L, …)"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            />
            <input
              className="input"
              type="number"
              min={0}
              placeholder="Quantity in stock"
              value={form.quantityAvailable}
              onChange={(e) => setForm((f) => ({ ...f, quantityAvailable: e.target.value }))}
              required
            />
            <select
              className="input"
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            >
              {REGIONS.filter((r) => r !== "All").map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={form.organic}
              onChange={(e) => setForm((f) => ({ ...f, organic: e.target.checked }))}
            />
            Organic / agroecology listing
          </label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-stone-500 dark:text-stone-400">
              Product image (stored locally as preview)
            </label>
            <input type="file" accept="image/*" onChange={onImage} className="text-sm" />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-900 px-6 py-3 text-sm font-bold text-[var(--color-brand-lime)]"
          >
            {editingId ? "Save changes" : "Publish listing"}
          </button>
        </form>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Recent listings</h2>
        <ul className="mt-4 space-y-3">
          {listings.length === 0 && (
            <li className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500 dark:border-stone-600 dark:text-stone-400">
              No listings yet — add your first harvest.
            </li>
          )}
          {listings.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex min-w-0 items-center gap-3">
                <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-stone-900 dark:text-stone-50">
                    {p.name}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {p.region} · {formatETB(p.price)} / {p.unit}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="rounded-lg border border-stone-200 p-2 text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Orders received</h2>
        {receivedOrders.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
            No mock orders yet containing your seller ID.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {receivedOrders.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-stone-200 bg-white p-4 text-sm dark:border-stone-800 dark:bg-stone-900"
              >
                <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                  {o.id}
                </span>
                <span className="text-stone-500 dark:text-stone-400"> · {o.date}</span>
                <span className="ml-2 font-semibold text-emerald-800 dark:text-emerald-300">
                  {formatETB(o.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
        <Link to="/" className="font-semibold text-emerald-800 hover:underline dark:text-emerald-400">
          View public market →
        </Link>
      </p>
    </div>
  );
}

function BuyerView({ orders, favoriteItems }) {
  const recentSkus = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const o of orders) {
      for (const it of o.items || []) {
        if (!seen.has(it.id)) {
          seen.add(it.id);
          out.push(it);
        }
        if (out.length >= 6) return out;
      }
    }
    return out;
  }, [orders]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-emerald-950 dark:text-emerald-100">
        Buyer hub
      </h1>
      <p className="mt-1 text-stone-600 dark:text-stone-400">
        Order history, saved items, and recent purchases (device-local MVP).
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders placed" value={orders.length} icon={Package} />
        <StatCard label="Saved items" value={favoriteItems.length} icon={Sprout} />
        <StatCard label="Unique recent SKUs" value={recentSkus.length} icon={TrendingUp} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Order history</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">No orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="rounded-xl border border-stone-100 p-3 text-sm dark:border-stone-800"
                >
                  <span className="font-mono font-semibold">{o.id}</span> · {o.date} ·{" "}
                  <span className="text-emerald-800 dark:text-emerald-300">
                    {formatETB(o.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Saved items</h2>
          {favoriteItems.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
              Heart listings on the market to save them here.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {favoriteItems.map((p) => (
                <li key={p.id} className="text-sm font-medium text-stone-800 dark:text-stone-200">
                  {p.name}{" "}
                  <span className="text-stone-500 dark:text-stone-400">
                    · {formatETB(p.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Recent purchases</h2>
        {recentSkus.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">No purchase history yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {recentSkus.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-stone-100 p-3 dark:border-stone-800"
              >
                <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 text-sm">
                  <p className="truncate font-semibold text-stone-900 dark:text-stone-50">
                    {p.name}
                  </p>
                  <p className="text-stone-500 dark:text-stone-400">{p.region}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-8 text-center">
        <Link
          to="/account?tab=orders"
          className="text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-400"
        >
          Open full account →
        </Link>
      </p>
    </div>
  );
}

export default Dashboard;
