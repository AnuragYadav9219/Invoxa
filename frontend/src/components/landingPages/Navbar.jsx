import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Changed FiSparkles to FiZap
import { FiArrowRight, FiMenu, FiX, FiZap } from "react-icons/fi"; 

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

  const links = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-white/8 shadow-2xl shadow-black/40 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 ring-1 ring-white/20"
            >
              I
            </motion.div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                Invoxa
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase">
                <FiZap className="text-[9px]" /> AI Powered
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Smart Invoice Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-slate-900/40 p-1.5 rounded-full border border-white/8 backdrop-blur-md"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onMouseEnter={() => setHoveredLink(item.name)}
              className="relative px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 rounded-full"
            >
              {hoveredLink === item.name && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/25 ring-1 ring-white/10 overflow-hidden"
            >
              <span>Get Started</span>
              <FiArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-slate-950/95 border-b border-white/10 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 pt-4 pb-6 space-y-4">
              <nav className="flex flex-col space-y-3">
                {links.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-300 hover:text-white transition-colors py-1"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-300 hover:text-white border border-white/10 rounded-xl bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl flex items-center justify-center gap-2"
                >
                  Get Started
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}