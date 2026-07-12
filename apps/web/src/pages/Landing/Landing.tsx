import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Zap, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Truck,
    title: 'Fleet Management',
    description: 'Real-time tracking and management of your entire vehicle fleet.',
  },
  {
    icon: Shield,
    title: 'Safety Monitoring',
    description: 'Advanced driver safety scoring and incident tracking.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Comprehensive financial and operational analytics.',
  },
  {
    icon: Globe,
    title: 'Route Optimization',
    description: 'AI-powered route planning and trip management.',
  },
];

const stats = [
  { label: 'Trips Managed', value: '10,000+' },
  { label: 'Fleet Uptime', value: '99.9%' },
  { label: 'Cost Reduction', value: '32%' },
  { label: 'Active Users', value: '500+' },
];

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-charcoal overflow-hidden">
      {/* Noise texture */}
      <div className="noise-texture" />

      {/* Mesh gradient background */}
      <div className="fixed inset-0 mesh-gradient-bg pointer-events-none" />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan/[0.03] blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald/[0.03] blur-[100px] animate-float-slower" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-amber/[0.02] blur-[80px] animate-float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-emerald">
            <Zap className="w-5 h-5 text-charcoal" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-white">
            Transit<span className="text-cyan">Ops</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-muted hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link to="/login">
            <Button size="sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-20 text-center"
      >
        <motion.div variants={stagger.item}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan/5 border border-cyan/10 text-xs font-medium text-cyan mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-soft" />
            Next-Gen Fleet Management
          </span>
        </motion.div>

        <motion.h1
          variants={stagger.item}
          className="text-display md:text-hero font-bold text-white leading-tight mb-6"
        >
          Transport Operations
          <br />
          <span className="text-gradient">Reimagined</span>
        </motion.h1>

        <motion.p
          variants={stagger.item}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 text-balance"
        >
          The premium platform for managing fleets, drivers, trips, and finances
          with unprecedented visibility and control.
        </motion.p>

        <motion.div variants={stagger.item} className="flex items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg">
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            Watch Demo
          </Button>
        </motion.div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 max-w-5xl mx-auto px-8 pb-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card p-6 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-8 pb-32"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            A complete suite of tools to manage every aspect of your transport operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-4 group-hover:bg-cyan/15 transition-colors">
                <feature.icon className="w-6 h-6 text-cyan" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted">
          <span>© 2026 TransitOps. All rights reserved.</span>
          <span>Built for the future of transport.</span>
        </div>
      </footer>
    </div>
  );
}
