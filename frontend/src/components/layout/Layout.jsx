import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-green-50">

      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex pt-14">

        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out p-1 sm:p-1 md:p-4 lg:p-1 ${isOpen ? "md:ml-64" : "md:ml-20"
            }`}
        >
          <div className="animate-fadeInUp bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm sm:p-5 md:p-6 min-h-[calc(100vh-100px)]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}