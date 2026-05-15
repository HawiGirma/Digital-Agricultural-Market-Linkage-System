import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-emerald-950 text-emerald-50 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-brand-lime)]">AgriLink Ethiopia</h3>
            <p className="mt-2 text-sm text-emerald-200/80">
              Linking Ethiopian farmers to buyers with a lightweight digital marketplace MVP.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Market</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-emerald-200/90 transition hover:text-white">
                  Browse listings
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-emerald-200/90 transition hover:text-white">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-emerald-200/90 transition hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-emerald-200/90 transition hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Account</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-emerald-200/90 transition hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-emerald-200/90 transition hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-emerald-800/80 pt-8 text-center text-xs text-emerald-300/90">
          <p>&copy; {new Date().getFullYear()} AgriLink Ethiopia. MVP demo — not a licensed payment provider.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
