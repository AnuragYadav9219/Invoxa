import {
    Menu,
    Search,
    Bell,
    X,
    UserIcon,
    SettingsIcon,
    CreditCardIcon,
    LogOutIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tokenService } from "@/utils/tokenService";

export default function Navbar({ isOpen, setIsOpen }) {
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    /* ================= LOGOUT ================= */
    const handleLogout = () => {
        tokenService.clear();        // remove token + user
        navigate("/login");          // redirect
    };

    const user = tokenService.getUser();

    return (
        <>
            {/* NAVBAR */}
            <div className="fixed top-0 left-0 w-full h-14 bg-emerald-600 text-white flex items-center justify-between px-3 pr-5 shadow-md z-50">

                {/* LEFT */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-1.5 rounded-md hover:bg-white/20 cursor-pointer transition duration-200 active:scale-95"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <h1 className="font-semibold text-base truncate">
                        Invoxa
                    </h1>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 md:gap-5">

                    {/* Search */}
                    <button onClick={() => setShowSearch(true)}>
                        <Search size={20} />
                    </button>

                    <Bell size={20} className="cursor-pointer" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img
                                src="https://i.pravatar.cc/30"
                                alt="profile"
                                className="rounded-full w-8 h-8 border border-white/30 cursor-pointer"
                            />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48 z-70">
                            <div className="px-2 py-1 text-sm text-gray-500">
                                {user?.email || "user@example.com"}
                            </div>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <UserIcon size={16} className="mr-2" />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <CreditCardIcon size={16} className="mr-2" />
                                Billing
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <SettingsIcon size={16} className="mr-2" />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-red-500 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOutIcon size={16} className="mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* MOBILE SEARCH */}
            {showSearch && (
                <div className="fixed top-0 left-0 w-full h-14 bg-emerald-600 flex items-center px-3 gap-2 z-60 shadow-md">
                    <Search size={18} />

                    <Input
                        autoFocus
                        placeholder="Search..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") setShowSearch(false);
                        }}
                        className="flex-1 border-none bg-transparent text-white placeholder:text-emerald-200 focus-visible:ring-0"
                    />

                    <button onClick={() => setShowSearch(false)}>
                        <X />
                    </button>
                </div>
            )}
        </>
    );
}