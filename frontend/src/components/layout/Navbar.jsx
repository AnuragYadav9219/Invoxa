import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, LogOutIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useGetProfileQuery } from "@/features/user/userApi";

import ConfirmDialog from "../common/ConfirmDialog";
import Spinner from "../loaders/Spinner";
import NotificationBell from "@/features/notification/components/NotificationBell";

export default function Navbar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const { data } = useGetProfileQuery();
  const profile = data?.data;

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="relative flex h-14 items-center justify-between border-b border-slate-200/60 bg-white/70 px-3 pr-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-2xl">
        
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/60 to-transparent" />

        <div className="relative z-10 flex items-center gap-3">
          
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="group rounded-xl p-2 cursor-pointer text-slate-500 transition-all active:scale-95 hover:bg-slate-100/50 hover:text-indigo-600"
          >
            {isOpen ? (
              <X size={20} className="transition-transform group-hover:rotate-90" />
            ) : (
              <Menu size={20} className="transition-transform group-hover:scale-110" />
            )}
          </button>

          <Link 
            to="/dashboard" 
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition-transform group-hover:scale-105">
              I
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              Invoxa
            </h1>
          </Link>
        </div>

        {/* --- Right Side: Notifications & Profile --- */}
        <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
          
          <NotificationBell />

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-slate-200/80" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer rounded-xl p-1.5 outline-none transition-colors hover:bg-slate-100/50 focus:bg-slate-100/50">
                <div className="flex h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-linear-to-br from-indigo-500 to-purple-500 items-center justify-center shadow-sm">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>

            {/* Dropdown Menu Content */}
            <DropdownMenuContent
              align="end"
              className="mt-2 w-56 rounded-xl border border-white/60 bg-white/80 p-1.5 shadow-xl backdrop-blur-2xl"
            >
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs font-medium text-slate-500">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator className="bg-slate-100" />

              <ConfirmDialog
                type="logout"
                description="Are you sure you want to logout?"
                onConfirm={handleLogout}
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50"
                >
                  {isLoading ? (
                    <>
                      <Spinner size={16} />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOutIcon size={16} />
                      <span>Logout</span>
                    </>
                  )}
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </div>
      </div>
    </div>
  );
}