import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, User, Mail, Lock, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      setName("");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center overflow-hidden px-4">
      {/* Background Motion Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] blur-3xl"
      />

      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-xl"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center shadow-inner border border-white/20"
          >
            <Briefcase className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mt-4 tracking-tight">
            Create Your Freelancer Account
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage your clients, projects & payments in one place
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-red-400 text-sm mb-3 bg-red-950/40 px-3 py-2 rounded-lg text-center border border-red-800"
          >
            {error}
          </motion.p>
        )}

        {/* Signup Form */}
        <motion.form
          onSubmit={handleSignup}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Name */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm text-neutral-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-neutral-700 pl-10 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm text-neutral-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5" />
              <input
                type="email"
                placeholder="you@freelance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-neutral-700 pl-10 pr-3 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-700 pl-10 pr-10 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-white text-black py-2.5 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Create Account
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-neutral-400 text-sm text-center mt-6"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white underline-offset-2 hover:underline font-medium"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
