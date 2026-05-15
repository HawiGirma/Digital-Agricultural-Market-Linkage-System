import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      setError("Please enter email and password");
      setIsLoading(false);
      return;
    }

    let role = "buyer";
    const em = email.toLowerCase().trim();
    if (em === "admin@agrilink.et") role = "admin";
    else if (em.includes("farmer") || em.endsWith(".farmer")) role = "farmer";

    const nameFromEmail = em.split("@")[0].replace(/[._]/g, " ");
    login({
      fullName: nameFromEmail.replace(/\b\w/g, (c) => c.toUpperCase()),
      email: em,
      phone: "+251 900 000 000",
      firstName: nameFromEmail.split(" ")[0] || "User",
      lastName: nameFromEmail.split(" ").slice(1).join(" ") || "",
      role,
    });
    navigate("/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-12 dark:bg-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md"
      >
        <Link to="/">
          <motion.span
            whileHover={{ x: -4 }}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to market
          </motion.span>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-900 text-[var(--color-brand-lime)]">
              <LogIn className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              AgriLink Ethiopia — demo roles: use email containing &quot;farmer&quot; for farmer, or{" "}
              <span className="font-mono text-xs">admin@agrilink.et</span> for admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11 pr-11"
                  placeholder="Any password for MVP"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-400"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 py-3.5 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-lime)] transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-brand-lime)] border-t-transparent" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-emerald-800 hover:underline dark:text-emerald-400">
              Create account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
export default Login;
