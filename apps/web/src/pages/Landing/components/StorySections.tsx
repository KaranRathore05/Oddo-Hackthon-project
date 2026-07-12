import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, AlertTriangle, Activity, Fuel, FileBarChart, Zap, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Reusable animated section wrapper
function StorySection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-screen flex items-center justify-center relative z-10 py-24 ${className}`}>
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

// Section 3: Driver Management
function SectionDrivers() {
  return (
    <StorySection className="text-right">
      <div className="max-w-2xl ml-auto flex flex-col items-end">
        <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mb-6 border border-emerald/20">
          <Shield className="w-6 h-6 text-emerald" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-6">Intelligent Driver Safety</h2>
        <p className="text-lg text-muted mb-12">
          Monitor driving behavior, track compliance, and reward your best performers.
          Safety scores grow dynamically as drivers complete flawless trips.
        </p>
        
        {/* Animated License/Profile Card */}
        <motion.div 
          whileHover={{ scale: 1.05, rotateY: 10 }}
          className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 backdrop-blur-md shadow-glass text-left relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-charcoal border border-white/10 overflow-hidden relative">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Driver" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
              <div className="absolute inset-0 shadow-inner-glow" />
            </div>
            <div>
              <h4 className="text-white font-medium text-lg">Alex Mercer</h4>
              <p className="text-emerald text-sm font-mono tracking-widest">ID: DL-2026</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Safety Score</span>
                <span className="text-emerald font-mono">98/100</span>
              </div>
              <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '98%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-emerald shadow-glow-emerald"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </StorySection>
  );
}

// Section 4: Fleet Tracking
function SectionTracking() {
  return (
    <StorySection>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-bold text-white mb-6">Precision Logistics</h2>
        <p className="text-xl text-muted">
          Watch your fleet move across the globe with millisecond latency. 
          Every delivery, every route, perfectly mapped.
        </p>
      </div>
      
      {/* Map visualization abstraction */}
      <div className="relative w-full h-96 rounded-3xl bg-charcoal border border-white/5 overflow-hidden shadow-glass flex items-center justify-center">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <Map className="w-32 h-32 text-white/5 absolute" />
        
        {/* Animated tracking nodes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [(Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600],
              y: [(Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
            className="absolute flex items-center justify-center w-8 h-8"
          >
            <div className="absolute w-full h-full rounded-full bg-cyan/20 animate-ping" />
            <div className="w-3 h-3 rounded-full bg-cyan shadow-glow-cyan" />
            <div className="absolute top-10 whitespace-nowrap px-2 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 text-xs font-mono text-cyan">
              TRK-{10 + i}
            </div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  );
}

// Section 5: Maintenance
function SectionMaintenance() {
  return (
    <StorySection>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative aspect-square">
          {/* Abstract Truck wireframe rotation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-64 h-64 preserve-3d"
            >
              <div className="absolute inset-0 border-2 border-amber/30 rounded-xl flex items-center justify-center bg-amber/5 backdrop-blur-sm" style={{ transform: 'translateZ(50px)' }}>
                <Truck className="w-32 h-32 text-amber/50" />
              </div>
              <div className="absolute inset-0 border border-amber/10 rounded-xl" style={{ transform: 'translateZ(-50px)' }} />
            </motion.div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mb-6 border border-amber/20">
            <Activity className="w-6 h-6 text-amber" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Predictive Maintenance</h2>
          <p className="text-lg text-muted mb-8">
            Identify mechanical faults before they become catastrophic failures. 
            Keep your assets on the road, not in the shop.
          </p>
          <div className="space-y-3">
            {[
              { part: 'Engine Diagnostics', status: 'Optimal', color: 'text-emerald' },
              { part: 'Brake Pads', status: 'Service Soon', color: 'text-amber' },
              { part: 'Transmission', status: 'Normal', color: 'text-cyan' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <span className="text-white/80">{item.part}</span>
                <span className={`text-sm font-mono ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StorySection>
  );
}

// Section 6: Fuel Management
function SectionFuel() {
  return (
    <StorySection>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-crimson/10 flex items-center justify-center mx-auto mb-8 border border-crimson/20">
          <Fuel className="w-8 h-8 text-crimson" />
        </div>
        <h2 className="text-5xl font-bold text-white mb-6">Eliminate Fuel Waste</h2>
        <p className="text-xl text-muted mb-16">
          Track every drop. Identify inefficient routes and driving patterns that drain your bottom line.
        </p>
        
        {/* Animated Fuel Graph */}
        <div className="h-64 flex items-end justify-center gap-2 px-8">
          {[40, 60, 45, 80, 50, 90, 70, 30, 85, 55].map((height, i) => (
            <div key={i} className="flex-1 bg-charcoal rounded-t-xl overflow-hidden relative">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-crimson/20 to-crimson border-t border-white/50"
              />
            </div>
          ))}
        </div>
      </div>
    </StorySection>
  );
}

// Section 7: Reports
function SectionReports() {
  return (
    <StorySection>
      <div className="flex flex-col md:flex-row gap-16 items-center justify-between">
        <div className="max-w-md">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/20">
            <FileBarChart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Financial Intelligence</h2>
          <p className="text-lg text-muted">
            Generate pixel-perfect PDF reports. Analyze revenue per mile, maintenance costs, and total fleet ROI in seconds.
          </p>
        </div>
        
        {/* Counter */}
        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-glass">
          <p className="text-sm text-muted mb-2 font-mono uppercase tracking-widest">Total Fleet Savings</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-emerald">$</span>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-7xl font-bold text-white tracking-tighter"
            >
              2.4<span className="text-4xl text-white/50">M</span>
            </motion.div>
          </div>
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
      <SectionDrivers />
      <SectionTracking />
      <SectionMaintenance />
      <SectionFuel />
      <SectionReports />
      <SectionCTA />
    </div>
  );
}
