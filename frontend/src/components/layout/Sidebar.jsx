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
import { useGetProfileQuery } from "@/features/user/userApi";

export default function Sidebar({ isOpen, setIsOpen }) {
  const handleClick = () => setIsOpen(false);
  const { user } = useSelector((state) => state.auth);
  const { data } = useGetProfileQuery();
  const profile = data?.data;

  const linkBase =
    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group";

  const getLinkClass = ({ isActive }) =>
    `${linkBase} ${isActive
      ? "bg-indigo-50/80 text-indigo-700 font-semibold shadow-sm shadow-indigo-100/50 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1.5 before:bg-indigo-600 before:rounded-r-full"
      : "text-slate-500 font-medium hover:bg-slate-50/80 hover:text-indigo-600"
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
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={handleClick}
        />
      )}

      {/* SIDEBAR - Improved border color to slate */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100%-3.5rem)] flex flex-col ${isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0 md:w-20"
          } bg-white/70 backdrop-blur-2xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] p-3 md:p-4 z-50 transition-all duration-300
        `}
      >

        {/* NAV LINKS */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <nav className="space-y-1">

            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleClick}
                className={getLinkClass}
                title={!isOpen ? label : ""}
              >
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                {isOpen && label}
              </NavLink>
            ))}

            {/* SALES - Softer slate text */}
            {isOpen && (
              <p className="text-[11px] font-semibold text-slate-400/80 mt-6 mb-2 px-2 tracking-widest uppercase">
                Sales
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
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                {isOpen && label}
              </NavLink>
            ))}

            {/* SYSTEM */}
            {isOpen && (
              <p className="text-[11px] font-semibold text-slate-400/80 mt-6 mb-2 px-2 tracking-widest uppercase">
                System
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
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                {isOpen && label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* PROFILE SECTION */}
        <div className="mt-4 border-t border-slate-200/60 pt-3">

          {isOpen && (
            <p className="text-[11px] font-semibold text-slate-400/80 mb-2 px-2 tracking-widest uppercase">
              Personal
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
              {/* Changed gradient to perfectly match layout (indigo/purple) */}
              <div className="w-9 h-9 min-w-9 min-h-9 rounded-full overflow-hidden border-2 border-white bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Online Indicator - Kept green as it implies online status */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* User Info */}
            {isOpen && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-700 transition-colors">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-slate-400 truncate">
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
            <Settings size={18} className="transition-transform group-hover:rotate-45 group-hover:scale-110 duration-300" />
            {isOpen && "Settings"}
          </NavLink>

        </div>
      </aside>
    </>
  );
}