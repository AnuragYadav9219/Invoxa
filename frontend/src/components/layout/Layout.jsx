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
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100">

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400/30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400/30 blur-3xl rounded-full animate-pulse"></div>

      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex pt-14 relative z-10">

        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out sm:p-4 md:p-3 ${isOpen ? "md:ml-64" : "md:ml-20"
            }`}
        >

          <div className="p-px rounded-3xl bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/70 backdrop-blur-2xl border p-1 border-white/40 rounded-sm shadow-xl min-h-[calc(100vh-100px)] overflow-hidden bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200"
            >

              <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none"></div>

              <div className="relative z-10 md:p-2 ">
                {children}
              </div>

            </motion.div>

          </div>

        </main>
      </div>
    </div>
  );
}
