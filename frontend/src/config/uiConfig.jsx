import { Trash2, RotateCcw, LogOut } from "lucide-react";

export const CONFIRM_DIALOG_VARIANTS = {
    delete: {
        title: "Delete item?",
        icon: <Trash2 className="text-rose-600 h-6 w-6" />,
        bg: "bg-rose-50",
        btn: "bg-rose-600 hover:bg-rose-700",
        confirmText: "Delete",
        loadingText: "Deleting...",
    },

    restore: {
        title: "Restore item?",
        icon: <RotateCcw className="text-green-600 h-6 w-6" />,
        bg: "bg-green-50",
        btn: "bg-green-600 hover:bg-green-700",
        confirmText: "Restore",
        loadingText: "Restoring...",
    },

    logout: {
        title: "Logout?",
        icon: <LogOut className="text-red-600 h-6 w-6" />,
        bg: "bg-red-50",
        btn: "bg-red-600 hover:bg-red-700",
        confirmText: "Logout",
        loadingText: "Logging out...",
    },
};