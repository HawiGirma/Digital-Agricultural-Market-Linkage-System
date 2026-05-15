import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Sprout,
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart } from "./ShoppingCart";
import { useTheme } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { cartItems, totalItems, updateQuantity, removeItem } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, LANGUAGE_OPTIONS } = useLocale();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: t("nav_market") },
    { path: "/categories", label: t("nav_categories") },
    { path: "/cart", label: t("nav_cart") },
    { path: "/about", label: t("nav_about") },
    { path: "/contact", label: t("nav_contact") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[var(--color-brand-cream)]/90 backdrop-blur-md transition-colors dark:border-stone-700/80 dark:bg-stone-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-[var(--color-brand-lime)] shadow-md ring-2 ring-[var(--color-brand-lime)]/40 transition group-hover:scale-105 dark:bg-emerald-950"
            >
              <Sprout className="h-6 w-6" strokeWidth={2.2} />
            </motion.div>
            <div className="min-w-0">
              <h1 className="truncate font-sans text-lg font-bold tracking-tight text-emerald-950 dark:text-emerald-100">
                AgriLink Ethiopia
              </h1>
              <p className="truncate text-[11px] font-medium text-stone-600 dark:text-stone-400">
                {t("brand_tagline")}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-stone-200/80 bg-white/70 px-1 py-1 shadow-sm dark:border-stone-700 dark:bg-stone-900/70 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  isActive(link.path)
                    ? "text-emerald-900 dark:text-[var(--color-brand-lime)]"
                    : "text-stone-600 hover:bg-stone-100 hover:text-emerald-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-emerald-200"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--color-brand-lime)]/35 dark:bg-emerald-800/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1 rounded-full border border-stone-200 bg-white/80 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-900 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-emerald-600"
              >
                {LANGUAGE_OPTIONS.find((l) => l.code === language)?.label ?? "EN"}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-30 cursor-default"
                      aria-label="Close menu"
                      onClick={() => setLangOpen(false)}
                    />
                    <motion.ul
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 z-40 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-xl dark:border-stone-600 dark:bg-stone-900"
                    >
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <li key={opt.code}>
                          <button
                            type="button"
                            onClick={() => {
                              setLanguage(opt.code);
                              setLangOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-emerald-50 dark:hover:bg-stone-800 ${
                              language === opt.code
                                ? "font-semibold text-emerald-800 dark:text-[var(--color-brand-lime)]"
                                : "text-stone-700 dark:text-stone-200"
                            }`}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-stone-200 bg-white/80 p-2.5 text-stone-700 transition hover:border-emerald-300 hover:text-emerald-900 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-emerald-600"
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="hidden rounded-full border border-stone-200 bg-white/80 p-2.5 text-stone-700 transition hover:border-emerald-300 hover:text-emerald-900 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 sm:block"
                title={t("nav_dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}

            <Link
              to={isLoggedIn ? "/account" : "/login"}
              className="hidden rounded-full border border-emerald-900/15 bg-emerald-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-brand-lime)] shadow-sm transition hover:bg-emerald-800 sm:inline-block"
            >
              {isLoggedIn ? (user?.firstName || t("nav_account")) : t("nav_login")}
            </Link>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2.5 text-stone-800 transition hover:bg-white/80 dark:text-stone-100 dark:hover:bg-stone-800"
            >
              <ShoppingBag className="h-6 w-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-brand-lime)] px-1 text-[10px] font-bold text-emerald-950"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2.5 text-stone-800 hover:bg-white/80 dark:text-stone-100 dark:hover:bg-stone-800 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-stone-200/80 dark:border-stone-700 md:hidden"
            >
              <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive(link.path)
                        ? "bg-[var(--color-brand-lime)]/25 text-emerald-900 dark:text-[var(--color-brand-lime)]"
                        : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isLoggedIn && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("nav_dashboard")}
                  </Link>
                )}
                <Link
                  to={isLoggedIn ? "/account" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl bg-emerald-900 px-4 py-3 text-center text-sm font-bold text-[var(--color-brand-lime)]"
                >
                  {isLoggedIn ? t("nav_account") : t("nav_login")}
                </Link>
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-red-600 dark:border-stone-600"
                  >
                    Log out
                  </button>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </>
  );
}

export default Header;
