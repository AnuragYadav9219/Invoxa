import BottomCTA from '@/components/landingPages/BottomCTA';
import FAQ from '@/components/landingPages/FAQ';
import Features from '@/components/landingPages/Features';
import Hero from '@/components/landingPages/Hero';
import LogoTicker from '@/components/landingPages/LogoTicker';
import Navbar from '@/components/landingPages/Navbar';
import Pricing from '@/components/landingPages/Pricing';
import Testimonials from '@/components/landingPages/Testimonials';
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden antialiased">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-150 bg-linear-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-[130px]" />
                <div className="absolute top-700 left-0 w-125 h-125 bg-violet-600/5 blur-[140px]" />
            </div>

            <Navbar />
            <Hero />
            <LogoTicker />
            <Features />
            <Testimonials />
            <Pricing />
            <FAQ />
            <BottomCTA />

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-600">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                    <div className="flex items-center space-x-2 opacity-80">
                        <span className="font-bold tracking-tight text-slate-400">
                            Invoxa
                        </span>
                        <span>&copy; 2026 Invoxa. All rights reserved.</span>
                    </div>

                    <div className="flex items-center space-x-6 text-slate-500">
                        <Link
                            to="/privacy-policy"
                            className="transition-colors hover:text-slate-300"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            to="/terms-of-service"
                            className="transition-colors hover:text-slate-300"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}