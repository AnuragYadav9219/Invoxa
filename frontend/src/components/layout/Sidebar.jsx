import { NavLink } from "react-router-dom";
import {
  Home,
  Package,
  Banknote,
  FileText,
  Users,
  CreditCard,
  Trash2,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const handleClick = () => setIsOpen(false);

  const linkBase =
    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group";

  const getLinkClass = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 font-medium shadow-sm"
        : "text-gray-600 hover:bg-white/60 hover:shadow hover:text-gray-900"
    }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={handleClick}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed top-14 left-0 h-[calc(100%-3.5rem)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${isOpen ? "w-64" : "md:w-20"}
        w-64
        bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-lg
        p-3 md:p-4 z-50 transition-all duration-300
        `}
      >
        {/* LOGO */}
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white font-bold text-lg shadow">
            I
          </div>
          {isOpen && <h2 className="text-lg font-semibold">Invoxa</h2>}
        </div>

        {/* NAV LINKS */}
        <nav className="space-y-2">

          <NavLink to="/dashboard" onClick={handleClick} className={getLinkClass}>
            <Home size={18} className="transition group-hover:scale-110" />
            {isOpen && "Dashboard"}
          </NavLink>

          <NavLink to="/items" onClick={handleClick} className={getLinkClass}>
            <Package size={18} className="transition group-hover:scale-110" />
            {isOpen && "Items"}
          </NavLink>

          <NavLink to="/banking" onClick={handleClick} className={getLinkClass}>
            <Banknote size={18} className="transition group-hover:scale-110" />
            {isOpen && "Banking"}
          </NavLink>

        </nav>

        {/* SALES */}
        {isOpen && (
          <p className="text-xs text-gray-400 mt-6 mb-2 px-2 tracking-wider">
            SALES
          </p>
        )}

        <nav className="space-y-2">

          <NavLink to="/customers" onClick={handleClick} className={getLinkClass}>
            <Users size={18} className="transition group-hover:scale-110" />
            {isOpen && "Customers"}
          </NavLink>

          <NavLink to="/invoices" onClick={handleClick} className={getLinkClass}>
            <FileText size={18} className="transition group-hover:scale-110" />
            {isOpen && "Invoices"}
          </NavLink>

          <NavLink to="/payments" onClick={handleClick} className={getLinkClass}>
            <CreditCard size={18} className="transition group-hover:scale-110" />
            {isOpen && "Payments"}
          </NavLink>

        </nav>

        {/* SYSTEM */}
        {isOpen && (
          <p className="text-xs text-gray-400 mt-6 mb-2 px-2 tracking-wider">
            SYSTEM
          </p>
        )}

        <nav className="space-y-2">
          <NavLink to="/trash" onClick={handleClick} className={getLinkClass}>
            <Trash2 size={18} className="transition group-hover:scale-110" />
            {isOpen && "Trash"}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}