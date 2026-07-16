import BottomCTA from '@/components/landingPages/BottomCTA';
import FAQ from '@/components/landingPages/FAQ';
import Features from '@/components/landingPages/Features';
import Hero from '@/components/landingPages/Hero';
import LivePlayground from '@/components/landingPages/LivePlayground';
import LogoTicker from '@/components/landingPages/LogoTicker';
import Navbar from '@/components/landingPages/Navbar';
import Pricing from '@/components/landingPages/Pricing';
import Testimonials from '@/components/landingPages/Testimonials';
import React from 'react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden antialiased">
            {/* Background Radial Glow Arraying */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-[130px] pointer-events-none" />
            <div className="absolute top-[2800px] left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[140px] pointer-events-none" />

            <Navbar />
            <Hero />
            <LogoTicker />
            <LivePlayground />
            <Features />
            <Testimonials />
            <Pricing />
            <FAQ />
            <BottomCTA />

            {/* Footer */}
            <footer className="border-t border-slate-900 text-slate-600 text-xs py-12 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2 opacity-80">
                        <span className="font-bold tracking-tight text-slate-400">Invoxa</span>
                        <span>&copy; 2026 Inc. All rights reserved.</span>
                    </div>
                    <div className="flex space-x-6 text-slate-500">
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}