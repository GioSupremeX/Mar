import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = useAdminLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    loginMutation.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          localStorage.setItem("admin_token", data.token);
          setLocation("/admin/dashboard");
        },
        onError: () => {
          setError(true);
          setTimeout(() => setError(false), 500); // Reset for next shake
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto text-[var(--app-accent)] mb-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor"/>
        </svg>
        
        <h1 className="font-display italic text-3xl text-[var(--ink-muted)] mb-12">Admin</h1>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className={error ? "animate-[shake_0.5s_ease-in-out]" : ""}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bottom-border-input text-center text-xl font-sans text-[var(--ink)] placeholder:text-[var(--ink-muted)]/40 px-4 py-3 h-auto"
              autoFocus
              autoComplete="current-password"
            />
            {error && <p className="text-red-500 text-sm mt-2 font-sans">Wrong password</p>}
          </div>
          
          <button 
            type="submit"
            disabled={loginMutation.isPending || !password}
            className="text-[var(--ink)] font-sans font-medium opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest text-sm disabled:opacity-30"
          >
            {loginMutation.isPending ? "Entering..." : "Enter"}
          </button>
        </form>
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
