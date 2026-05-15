import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-12 dark:bg-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md"
      >
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900">
          {!submitted ? (
            <>
              <h1 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
                Reset password
              </h1>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                MVP: no email is sent. This screen confirms the UX flow only.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-11"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-emerald-900 py-3 text-sm font-bold text-[var(--color-brand-lime)] transition hover:bg-emerald-800"
                >
                  Send reset link (mock)
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
                Check your email
              </h1>
              <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                If <span className="font-mono font-semibold">{email}</span> were registered, a reset
                link would appear here in a production build.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
