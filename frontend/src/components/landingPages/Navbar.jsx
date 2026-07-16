import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <nav className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        I
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-white transition-all duration-300">
                        Invoxa
                    </span>
                </div>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
                    {['Features', 'Pricing', 'Docs'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="relative hover:text-white transition-colors duration-200 group py-2"
                        >
                            {item}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-300 ease-out" />
                        </a>
                    ))}
                </div>

                <div>
                    <button className="px-4 py-2 text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 transition-all hover:bg-slate-800 shadow-inner">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}