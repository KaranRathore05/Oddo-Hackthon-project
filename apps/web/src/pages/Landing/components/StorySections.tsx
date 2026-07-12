import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, AlertTriangle, Activity, Fuel, FileBarChart, Zap, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Reusable animated section wrapper
function StorySection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-screen flex items-center justify-center relative z-10 py-24 snap-start ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl mx-auto px-8"
      >
        {children}
      </motion.div>
    </section>
  );
}

// Section 1: The Problem
function SectionProblem() {
  return (
    <StorySection>
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-16 h-16 rounded-2xl bg-charcoal border border-white/10 flex items-center justify-center mb-8 shadow-glass"
        >
          <AlertTriangle className="w-8 h-8 text-amber" />
        </motion.div>
        <h2 className="text-display font-bold text-white mb-6 tracking-tight leading-tight">
          The chaos of <br />
          <span className="text-white/40">disconnected</span> fleets.
        </h2>
        <p className="text-xl text-muted leading-relaxed">
          Traffic delays. Unexpected maintenance. Fuel theft. 
          When your vehicles operate in silos, you lose money every mile. 
          It's time to connect the dots.
        </p>
      </div>
    </StorySection>
  );
}

// Section 2: Operations / Dashboard Reveal
function SectionOperations() {
  return (
    <StorySection>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-6 border border-cyan/20">
            <Zap className="w-6 h-6 text-cyan" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Total Operational Command</h2>
          <p className="text-lg text-muted mb-8">
            Enter a unified ecosystem where every vehicle, driver, and route is instantly visible. 
            Connect your entire logistics network into one premium dashboard.
          </p>
          <ul className="space-y-4">
            {['Real-time telemetry mapping', 'Algorithmic route optimization', 'Instant dispatch connectivity'].map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="flex items-center gap-3 text-white/80"
              >
                <div className="w-2 h-2 rounded-full bg-cyan shadow-glow-cyan" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="relative">
          {/* Abstract Dashboard UI */}
          <motion.div 
            initial={{ opacity: 0, rotateX: 10, y: 50 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            style={{ perspective: 1000 }}
            className="w-full aspect-[4/3] rounded-2xl bg-slate-900 border border-white/10 shadow-glass-lg overflow-hidden flex flex-col"
          >
            <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-charcoal">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <div className="w-3 h-3 rounded-full bg-amber" />
              <div className="w-3 h-3 rounded-full bg-emerald" />
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="h-8 w-1/3 bg-white/5 rounded-lg" />
              <div className="flex-1 flex gap-4">
                <div className="w-2/3 bg-white/[0.02] rounded-xl border border-white/5 relative overflow-hidden">
                  {/* Fake map lines animated */}
                  <motion.div 
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-mesh-gradient opacity-20"
                  />
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-cyan shadow-glow-cyan animate-pulse-soft" />
                </div>
                <div className="w-1/3 flex flex-col gap-4">
                  <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5" />
                  <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </StorySection>
  );
}

// Section 3: Feature Bento Grid
function SectionFeatures() {
  return (
    <StorySection className="items-start py-32">
      <div className="w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">Complete Ecosystem</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Everything you need to run a world-class fleet, packed into a single, unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto auto-rows-[280px]">
          {/* Tracking - Span 2 cols */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-2 glass-card p-6 flex flex-col relative group overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center mb-4 border border-cyan/20">
                <Map className="w-5 h-5 text-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Precision Tracking</h3>
              <p className="text-muted text-sm max-w-sm">Watch your fleet move across the globe with millisecond latency.</p>
            </div>
            
            {/* Animated tracking nodes */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
                    y: [(Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150],
                  }}
                  transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
                  className="absolute top-1/2 left-1/2 flex items-center justify-center w-8 h-8"
                >
                  <div className="absolute w-full h-full rounded-full bg-cyan/20 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-cyan shadow-glow-cyan" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Drivers */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center mb-4 border border-emerald/20">
              <Shield className="w-5 h-5 text-emerald" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Driver Safety</h3>
            <p className="text-muted text-sm mb-6">Monitor behavior and track compliance dynamically.</p>
            
            <div className="mt-auto">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted">Safety Score</span>
                <span className="text-emerald font-mono">98/100</span>
              </div>
              <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '98%' }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-emerald shadow-glow-emerald"
                />
              </div>
            </div>
          </motion.div>

          {/* Fuel */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col relative overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-crimson/10 flex items-center justify-center mb-4 border border-crimson/20">
              <Fuel className="w-5 h-5 text-crimson" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fuel Efficiency</h3>
            <p className="text-muted text-sm relative z-10">Identify inefficient routes that drain your bottom line.</p>
            
            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 px-4 opacity-30 group-hover:opacity-80 transition-opacity">
              {[40, 60, 45, 80, 50, 90, 70, 30].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className="flex-1 bg-gradient-to-t from-crimson/20 to-crimson border-t border-white/20 rounded-t-sm"
                />
              ))}
            </div>
          </motion.div>

          {/* Maintenance */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center mb-4 border border-amber/20 relative z-10">
              <Activity className="w-5 h-5 text-amber" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Predictive Maintenance</h3>
            <p className="text-muted text-sm relative z-10">Keep your assets on the road, not in the shop.</p>
            
            <div className="absolute -right-4 -bottom-4 opacity-30 group-hover:opacity-60 transition-opacity">
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 preserve-3d"
              >
                <div className="absolute inset-0 flex items-center justify-center text-amber">
                  <Truck className="w-16 h-16" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Reports */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/20">
              <FileBarChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Financial Intelligence</h3>
            <p className="text-muted text-sm mb-6">Analyze revenue, costs, and ROI in seconds.</p>
            
            <div className="mt-auto h-20 flex items-end justify-between gap-1">
              {[40, 70, 45, 90, 60].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className="w-full bg-emerald/20 border-t border-emerald/50 rounded-t-sm"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </StorySection>
  );
}

// Section 8: CTA
function SectionCTA() {
  return (
    <StorySection className="min-h-[70vh]">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-display font-bold text-white mb-8">
            Ready to deploy?
          </h2>
          <Link to="/login" className="inline-block">
            <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-white text-charcoal hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Initialize Operations <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </StorySection>
  );
}

export function StorySections() {
  return (
    <div className="relative w-full">
      <SectionProblem />
      <SectionOperations />
      <SectionFeatures />
      <SectionCTA />
    </div>
  );
}
