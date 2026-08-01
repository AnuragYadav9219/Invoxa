import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100">
      
      <div className="pointer-events-none absolute -left-10 top-0 h-96 w-96 animate-pulse rounded-full bg-purple-400/30 blur-[100px] will-change-transform" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-96 w-96 animate-pulse rounded-full bg-pink-400/30 blur-[100px] will-change-transform" />

      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* --- Layout Wrapper --- */}
      <div className="relative z-10 flex pt-14">
        
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* --- Main Content Area --- */}
        <main
          className={`flex-1 transition-[margin] duration-300 ease-in-out p-1 sm:p-4 md:p-6 ${
            isOpen ? "md:ml-64" : "md:ml-20"
          }`}
        >
          {/* Page Transition Wrapper */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative min-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl border border-white/60 bg-white/50 px-1 shadow-xl backdrop-blur-xl md:p-6"
          >
            {/* Inner Glass Highlights */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/40 to-transparent" />

            <div className="relative z-10">
              {children}
            </div>
            
          </motion.div>
        </main>
      </div>
    </div>
  );
}