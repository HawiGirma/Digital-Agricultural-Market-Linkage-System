import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agreedToTerms) newErrors.terms = "You must agree to terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    let role = formData.role;
    const em = formData.email.toLowerCase().trim();
    if (em === "admin@agrilink.et") role = "admin";

    const userData = {
      fullName: formData.fullName.trim(),
      email: em,
      phone: formData.phone.trim(),
      firstName: formData.fullName.trim().split(" ")[0],
      lastName: formData.fullName.trim().split(" ").slice(1).join(" "),
      role,
    };

    login(userData);
    navigate("/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-12 dark:bg-stone-950">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md">
        <Link to="/">
          <span className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400">
            <ArrowLeft size={16} />
            Back to market
          </span>
        </Link>

        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="mb-6 text-center">
            <UserPlus className="mx-auto mb-3 h-9 w-9 text-emerald-800 dark:text-emerald-400" />
            <h1 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
              Join AgriLink
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Buyers, farmers, and admins (admin email enforced at login).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-stone-500 dark:text-stone-400">
                I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="buyer">Buyer</option>
                <option value="farmer">Farmer / producer</option>
              </select>
            </div>

            <input
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="input"
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

            <input
              name="phone"
              placeholder="Phone (+251…)"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}

            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              I agree to the marketplace terms (MVP placeholder)
            </label>
            {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-emerald-900 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-lime)] transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {isLoading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-800 hover:underline dark:text-emerald-400">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
export default Signup;
