import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Lenis from 'lenis';

import { Hero3DScene } from './components/Hero3DScene';
import { StorySections } from './components/StorySections';

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger if GSAP is used
    // This is optional but good for sync
    lenis.on('scroll', ScrollTrigger.update);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  useEffect(() => {
    // Enable native CSS scroll snapping on the html element for this page
    document.documentElement.classList.add('snap-y', 'snap-mandatory');
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.classList.remove('snap-y', 'snap-mandatory');
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="bg-charcoal text-white selection:bg-cyan/30">
      {/* 3D Background */}
      <Hero3DScene />

      {/* Navigation Layer */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-emerald">
              <Zap className="w-5 h-5 text-charcoal" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              TransitOps
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-500 ease-out"
            >
              Sign In
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-white text-charcoal hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Initial Hero Text (disappears on scroll) */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center pointer-events-none snap-start">
        <div className="text-center mt-20">
          <h1 className="text-display md:text-[8rem] font-bold tracking-tighter leading-[0.9]">
            OPERATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/20">AT SCALE</span>
          </h1>
          <p className="mt-8 text-xl text-white/50 max-w-lg mx-auto font-mono">
            Scroll to initialize systems
          </p>
          <div className="mt-12 animate-bounce w-px h-16 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
        </div>
      </section>

      {/* The Story */}
      <StorySections />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-8 bg-charcoal snap-start">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted font-mono">
          <span>© 2026 TransitOps. System Online.</span>
          <span>End of transmission.</span>
        </div>
      </footer>
    </div>
  );
}
