import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [, setLocation] = useLocation();
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAttemptsLeft(null);

    if (cooldown > 0) {
      setError(`Locked. Wait ${cooldown}s.`);
      return;
    }

    loginMutation.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          localStorage.setItem("admin_token", data.token);
          setLocation("/admin/dashboard");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || "Wrong password";
          const remaining = err?.response?.data?.attemptsRemaining;
          const cd = err?.response?.data?.cooldownSeconds;

          if (cd) {
            setCooldown(cd);
            setError(msg);
          } else {
            setError(msg);
            if (remaining !== undefined) {
              setAttemptsLeft(remaining);
            }
          }
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--app-accent), transparent 70%)" }} />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, var(--app-accent-pink), transparent 70%)" }} />

      <div className="w-full max-w-sm text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto text-[var(--app-accent)] mb-8" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display italic text-3xl text-[var(--ink-muted)] mb-12"
        >
          Admin
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleLogin}
          className="space-y-8"
        >
          <div className={error ? "animate-[shake_0.5s_ease-in-out]" : ""}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bottom-border-input text-center text-xl font-sans text-[var(--ink)] placeholder:text-[var(--ink-muted)]/40 px-4 py-3 h-auto"
              autoFocus
              autoComplete="current-password"
              disabled={cooldown > 0}
            />
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm mt-2 font-sans"
                >
                  {error}
                  {attemptsLeft !== null && attemptsLeft > 0 && (
                    <span className="block text-xs mt-1 opacity-70">{attemptsLeft} attempts remaining</span>
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={loginMutation.isPending || !password || cooldown > 0}
            whileHover={cooldown === 0 ? { y: -2 } : {}}
            whileTap={cooldown === 0 ? { scale: 0.95 } : {}}
            className="text-[var(--ink)] font-sans font-medium opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest text-sm disabled:opacity-30"
          >
            {cooldown > 0 ? `Locked (${cooldown}s)` : loginMutation.isPending ? "Entering..." : "Enter"}
          </motion.button>
        </motion.form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
