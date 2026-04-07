// import { NavLink } from "react-router-dom";
// import {
//     Home,
//     Package,
//     Banknote,
//     FileText,
//     Users,
//     X,
//     Trash2,
// } from "lucide-react";

// export default function Sidebar({ isOpen, setIsOpen }) {
//     const linkClass = "flex items-center gap-3 px-3 py-2 rounded-md text-sm";

//     return (
//         <>
//             {/* Overlay (mobile only) */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/30 z-40 md:hidden"
//                     onClick={() => setIsOpen(false)}
//                 />
//             )}

//             {/* Sidebar */}
//             <div
//                 className={`fixed md:fixed top-14 left-0 h-[calc(100%-3.5rem)] w-64 bg-gray-50 border-r p-4 z-50 transform transition-transform duration-300
//                 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
//             >
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-lg font-semibold">Invoxa</h2>
//                 </div>

//                 {/* Main */}
//                 <nav className="space-y-1">
//                     <NavLink
//                         to="/dashboard"
//                         onClick={() => setIsOpen(false)}
//                         className={({ isActive }) =>
//                             `${linkClass} ${isActive
//                                 ? "bg-gray-200 font-medium"
//                                 : "text-gray-600 hover:bg-gray-100"
//                             }`
//                         }
//                     >
//                         <Home size={16} />
//                         Home
//                     </NavLink>

//                     <NavLink to="/items" className={linkClass}>
//                         <Package size={16} />
//                         Items
//                     </NavLink>

//                     <NavLink to="/banking" className={linkClass}>
//                         <Banknote size={16} />
//                         Banking
//                     </NavLink>
//                 </nav>

//                 {/* Section Title */}
//                 <p className="text-xs text-gray-400 mt-6 mb-2">SALES</p>

//                 <nav className="space-y-1">
//                     <NavLink to="/customers" className={linkClass}>
//                         <Users size={16} />
//                         Customers
//                     </NavLink>

//                     <NavLink to="/invoices" className={linkClass}>
//                         <FileText size={16} />
//                         Invoices
//                     </NavLink>

//                     <NavLink to="/payments" className={linkClass}>
//                         <FileText size={16} />
//                         Payments
//                     </NavLink>
//                 </nav>

//                 {/* Section Title */}
//                 <p className="text-xs text-gray-400 mt-6 mb-2">SYSTEM</p>

//                 <nav className="space-y-1">
//                     <NavLink to="/trash" className={linkClass}>
//                         <Trash2 size={16} />
//                         Trash
//                     </NavLink>
//                 </nav>
//             </div>
//         </>
//     );
// }

























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
  const baseClass =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition";

  const getLinkClass = ({ isActive }) =>
    `${baseClass} ${
      isActive
        ? "bg-gray-200 font-medium text-black"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const handleClick = () => setIsOpen(false);

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={handleClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-14 left-0 h-[calc(100%-3.5rem)] w-64 bg-gray-50 border-r p-4 z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Invoxa</h2>
        </div>

        {/* MAIN */}
        <nav className="space-y-1">
          <NavLink to="/dashboard" onClick={handleClick} className={getLinkClass}>
            <Home size={16} />
            Home
          </NavLink>

          <NavLink to="/items" onClick={handleClick} className={getLinkClass}>
            <Package size={16} />
            Items
          </NavLink>

          <NavLink to="/banking" onClick={handleClick} className={getLinkClass}>
            <Banknote size={16} />
            Banking
          </NavLink>
        </nav>

        {/* SALES */}
        <p className="text-xs text-gray-400 mt-6 mb-2">SALES</p>

        <nav className="space-y-1">
          <NavLink to="/customers" onClick={handleClick} className={getLinkClass}>
            <Users size={16} />
            Customers
          </NavLink>

          <NavLink to="/invoices" onClick={handleClick} className={getLinkClass}>
            <FileText size={16} />
            Invoices
          </NavLink>

          <NavLink to="/payments" onClick={handleClick} className={getLinkClass}>
            <CreditCard size={16} /> {/* ✅ FIXED ICON */}
            Payments
          </NavLink>
        </nav>

        {/* SYSTEM */}
        <p className="text-xs text-gray-400 mt-6 mb-2">SYSTEM</p>

        <nav className="space-y-1">
          <NavLink to="/trash" onClick={handleClick} className={getLinkClass}>
            <Trash2 size={16} />
            Trash
          </NavLink>
        </nav>
      </div>
    </>
  );
}