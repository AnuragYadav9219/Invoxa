import {
    Menu,
    Bell,
    X,
    UserIcon,
    SettingsIcon,
    CreditCardIcon,
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
import { tokenService } from "@/services/tokenService";

export default function Navbar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        tokenService.clear();
        navigate("/login");
    };

    const user = tokenService.getUser();

    return (
        <div className="fixed top-0 left-0 w-full z-50">

            <div className="
                relative h-14 flex items-center justify-between px-3 pr-5 backdrop-blur-2xl bg-white/40 border-b border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.05)]
            ">

                <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent pointer-events-none" />

                {/* LEFT */}
                <div className="flex items-center gap-2 relative z-10">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-2 rounded-lg hover:bg-white/40 transition active:scale-95"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <h1 className="font-semibold text-base">
                        Invoxa
                    </h1>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4 relative z-10">

                    <div className="relative cursor-pointer group">
                        <Bell size={20} className="transition group-hover:scale-110" />

                        {/* Pulse */}
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img
                                src="https://i.pravatar.cc/30"
                                alt="profile"
                                className="
                                    rounded-full w-8 h-8 
                                    border border-white/40
                                    cursor-pointer 
                                    transition hover:scale-105
                                "
                            />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="
                                w-48 
                                backdrop-blur-xl bg-white/70 
                                border border-white/40 
                                shadow-lg
                            "
                        >
                            <div className="px-2 py-1 text-sm text-gray-500">
                                {user?.email || "user@example.com"}
                            </div>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="cursor-pointer">
                                <UserIcon size={16} className="mr-2" />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer">
                                <CreditCardIcon size={16} className="mr-2" />
                                Billing
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer">
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
        </div>
    );
}