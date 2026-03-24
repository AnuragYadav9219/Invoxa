import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const location = useLocation();

  // Auto close sidebar for mobile
  useEffect(() => {
    setIsOpen(false); 
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex flex-1 pt-14">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isOpen ? "md:ml-64" : ""}`}>
          {children}
        </div>

      </div>
    </div>
  );
}