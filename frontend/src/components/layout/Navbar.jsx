import {
    Menu,
    Bell,
    X,
    LogOutIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import ConfirmDialog from "../common/ConfirmDialog";
import Spinner from "../loaders/Spinner";
import { useEffect } from "react";
import NotificationBell from "@/features/notification/components/NotificationBell";

export default function Navbar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const [logout, { isLoading, isSuccess }] = useLogoutMutation();

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
        <div className="fixed top-0 left-0 w-full z-50">
            <div className="relative h-14 flex items-center justify-between px-2 pr-2 backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">

                <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent pointer-events-none" />

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-2 rounded-lg cursor-pointer hover:bg-white/60 transition active:scale-95"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white font-bold text-sm shadow">
                            I
                        </div>
                        <h1 className="font-semibold text-gray-800 tracking-tight">
                            Invoxa
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-1 relative z-10">

                    <NotificationBell />

                    <div className="h-6 w-px bg-gray-200/60" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-white/60 transition">
                                <img
                                    src="https://i.pravatar.cc/40"
                                    alt="profile"
                                    className="w-8 h-8 rounded-full border border-white/50"
                                />
                            </div>
                        </DropdownMenuTrigger>

                        {/* DROPDOWN */}
                        <DropdownMenuContent
                            align="end"
                            className="w-56 mt-2 backdrop-blur-xl bg-white/90 border border-white/40 shadow-xl rounded-xl p-1"
                        >

                            <div className="px-3 py-2">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <DropdownMenuSeparator />

                            <ConfirmDialog
                                type="logout"
                                description="Are you sure you want to logout?"
                                onConfirm={handleLogout}
                            >
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-500 cursor-pointer flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-red-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner size={14} />
                                            Logging out...
                                        </>
                                    ) : (
                                        <>
                                            <LogOutIcon size={16} />
                                            Logout
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