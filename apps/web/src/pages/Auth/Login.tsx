import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate auth — in production this calls authService.login()
    setTimeout(() => {
      login(
        {
          id: '1',
          email: email || 'admin@transitops.io',
          name: 'Admin User',
          role: 'FLEET_MANAGER',
        },
        'demo-jwt-token'
      );
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-charcoal flex">
      {/* Noise texture */}
      <div className="noise-texture" />

      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan/[0.04] blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald/[0.04] blur-[80px] animate-float" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 max-w-md px-12"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan to-emerald">
              <Zap className="w-6 h-6 text-charcoal" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-white">
              Transit<span className="text-cyan">Ops</span>
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Command Your
            <br />
            <span className="text-gradient">Fleet Operations</span>
          </h2>

          <p className="text-muted text-base leading-relaxed">
            Access real-time fleet tracking, driver management, and financial analytics
            from a single premium dashboard.
          </p>

          {/* Floating glass cards */}
          <div className="mt-12 space-y-3">
            {[
              { label: 'Real-time fleet monitoring', delay: 0.2 },
              { label: 'Advanced driver safety scoring', delay: 0.4 },
              { label: 'Comprehensive financial reports', delay: 0.6 },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card px-4 py-3 flex items-center gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-soft" />
                <span className="text-sm text-white/70">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-emerald">
              <Zap className="w-5 h-5 text-charcoal" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white">
              Transit<span className="text-cyan">Ops</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-muted text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              placeholder="admin@transitops.io"
              error={error}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan focus:ring-cyan/30"
                />
                Remember me
              </label>
              <button type="button" className="text-cyan hover:text-cyan-400 transition-colors text-xs">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/" className="text-cyan hover:text-cyan-400 transition-colors">
              Get started
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
