import { NavLink } from "react-router-dom";
import {
  Home,
  Package,
  FileText,
  Users,
  CreditCard,
  Trash2,
  Settings,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Sidebar({ isOpen, setIsOpen }) {
  const handleClick = () => setIsOpen(false);
  const { user } = useSelector((state) => state.auth);

  const linkBase =
    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group";

  const getLinkClass = ({ isActive }) =>
    `${linkBase} ${isActive
      ? "bg-emerald-50 text-emerald-700 font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:bg-emerald-500 before:rounded-r"
      : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
    }`;

  const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/items", label: "Items", icon: Package },
  ];

  const SALES_ITEMS = [
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/invoices", label: "Invoices", icon: FileText },
    { to: "/payments", label: "Payments", icon: CreditCard },
  ];

  const SYSTEM_ITEMS = [
    { to: "/trash", label: "Trash", icon: Trash2 },
  ];

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
          fixed top-14 left-0 h-[calc(100%-3.5rem)] flex flex-col ${isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0 md:w-20"} bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-sm p-3 md:p-4 z-50 transition-all duration-300
        `}
      >

        {/* NAV LINKS */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <nav className="space-y-1">

            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleClick}
                className={getLinkClass}
                title={!isOpen ? label : ""}
              >
                <Icon size={18} />
                {isOpen && label}
              </NavLink>
            ))}

            {/* SALES */}
            {isOpen && (
              <p className="text-[11px] text-gray-400 mt-5 mb-2 px-2 tracking-wider">
                SALES
              </p>
            )}

            {SALES_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleClick}
                className={getLinkClass}
                title={!isOpen ? label : ""}
              >
                <Icon size={18} />
                {isOpen && label}
              </NavLink>
            ))}

            {/* SYSTEM */}
            {isOpen && (
              <p className="text-[11px] text-gray-400 mt-5 mb-2 px-2 tracking-wider">
                SYSTEM
              </p>
            )}

            {SYSTEM_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleClick}
                className={getLinkClass}
                title={!isOpen ? label : ""}
              >
                <Icon size={18} />
                {isOpen && label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* PROFILE SECTION */}
        <div className="mt-4 border-t border-gray-200/60 pt-3">

          {isOpen && (
            <p className="text-[11px] text-gray-400 mb-2 px-2 tracking-wider">
              PERSONAL
            </p>
          )}

          {/* PROFILE */}
          <NavLink
            to="/profile"
            onClick={handleClick}
            className={({ isActive }) =>
              `${getLinkClass({ isActive })} ${!isOpen ? "justify-center px-0" : ""}`
            }
            title="Profile"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src="https://i.pravatar.cc/40"
                className="w-9 h-9 min-w-9 min-h-9 rounded-full object-cover border border-white/60"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* User Info */}
            {isOpen && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user?.email}
                </span>
              </div>
            )}
          </NavLink>

          {/* SETTINGS */}
          <NavLink
            to="/settings"
            onClick={handleClick}
            className={getLinkClass}
            title="Settings"
          >
            <Settings size={18} />
            {isOpen && "Settings"}
          </NavLink>

        </div>
      </aside>
    </>
  );
}