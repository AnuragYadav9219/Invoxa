import {
    AlertTriangle,
    Clock3,
    Inbox,
    ShieldAlert,
    WifiOff,
    Wrench,
} from "lucide-react";

export const variants = {
    server: {
        icon: AlertTriangle,
        badge: "System Interruption",

        title: "Server Error",
        description:
            "Something went wrong on our end. Please try again in a moment.",

        color: "text-red-600 dark:text-red-400",
        iconColor: "text-white",

        pageBg: "bg-red-50 dark:bg-slate-950",
        orb1: "bg-red-300/30 dark:bg-red-600/20",
        orb2: "bg-orange-300/30 dark:bg-orange-600/20",

        borderColor: "border-red-200 dark:border-red-900/40",
        bgGlow: "bg-red-500/10 dark:bg-red-500/20",

        accentBar: "from-red-600 via-rose-500 to-orange-400",
        iconGradient: "from-red-600 via-rose-500 to-orange-400",
        titleGradient: "from-red-700 via-red-900 to-slate-900",
        buttonGradient: "from-red-600 to-rose-600",

        trustBg: "bg-red-50 dark:bg-red-950/30",
        trustBorder: "border-red-100 dark:border-red-900/40",
        trustMessage:
            "Our engineering team has been notified. Your data remains safe.",
    },

    network: {
        icon: WifiOff,
        badge: "Network Issue",

        title: "No Internet Connection",
        description:
            "Please check your internet connection and try again.",

        color: "text-sky-600 dark:text-sky-400",
        iconColor: "text-white",

        pageBg: "bg-sky-50 dark:bg-slate-950",
        orb1: "bg-sky-300/30 dark:bg-sky-600/20",
        orb2: "bg-cyan-300/30 dark:bg-cyan-600/20",

        borderColor: "border-sky-200 dark:border-sky-900/40",
        bgGlow: "bg-sky-500/10 dark:bg-sky-500/20",

        accentBar: "from-sky-500 via-cyan-500 to-blue-600",
        iconGradient: "from-sky-500 via-cyan-500 to-blue-600",
        titleGradient: "from-sky-700 via-blue-800 to-slate-900",
        buttonGradient: "from-sky-600 to-blue-600",

        trustBg: "bg-sky-50 dark:bg-sky-950/30",
        trustBorder: "border-sky-100 dark:border-sky-900/40",
        trustMessage:
            "Reconnect to continue. Your unsaved changes remain intact.",
    },

    timeout: {
        icon: Clock3,
        badge: "Request Timeout",

        title: "Request Timed Out",
        description:
            "The server is taking too long to respond. Please try again.",

        color: "text-amber-600 dark:text-amber-400",
        iconColor: "text-white",

        pageBg: "bg-amber-50 dark:bg-slate-950",
        orb1: "bg-amber-300/30 dark:bg-amber-600/20",
        orb2: "bg-yellow-300/30 dark:bg-yellow-600/20",

        borderColor: "border-amber-200 dark:border-amber-900/40",
        bgGlow: "bg-amber-500/10 dark:bg-amber-500/20",

        accentBar: "from-amber-500 via-orange-500 to-yellow-500",
        iconGradient: "from-amber-500 via-orange-500 to-yellow-500",
        titleGradient: "from-amber-700 via-orange-700 to-slate-900",
        buttonGradient: "from-amber-600 to-orange-600",

        trustBg: "bg-amber-50 dark:bg-amber-950/30",
        trustBorder: "border-amber-100 dark:border-amber-900/40",
        trustMessage:
            "The request expired. Please try again in a few moments.",
    },

    empty: {
        icon: Inbox,
        badge: "No Data",

        title: "Nothing Here",
        description:
            "No data is available here yet.",

        color: "text-indigo-600 dark:text-indigo-400",
        iconColor: "text-white",

        pageBg: "bg-indigo-50 dark:bg-slate-950",
        orb1: "bg-indigo-300/30 dark:bg-indigo-600/20",
        orb2: "bg-violet-300/30 dark:bg-violet-600/20",

        borderColor: "border-indigo-200 dark:border-indigo-900/40",
        bgGlow: "bg-indigo-500/10 dark:bg-indigo-500/20",

        accentBar: "from-indigo-500 via-violet-500 to-blue-500",
        iconGradient: "from-indigo-500 via-violet-500 to-blue-500",
        titleGradient: "from-indigo-700 via-violet-700 to-slate-900",
        buttonGradient: "from-indigo-600 to-violet-600",

        trustBg: "bg-indigo-50 dark:bg-indigo-950/30",
        trustBorder: "border-indigo-100 dark:border-indigo-900/40",
        trustMessage:
            "Everything is working correctly. There's simply nothing to display yet.",
    },

    unauthorized: {
        icon: ShieldAlert,
        badge: "Access Denied",

        title: "Unauthorized Access",
        description:
            "You don't have permission to access this resource or your session has expired.",

        color: "text-rose-600 dark:text-rose-400",
        iconColor: "text-white",

        pageBg: "bg-rose-50 dark:bg-slate-950",
        orb1: "bg-rose-300/30 dark:bg-rose-600/20",
        orb2: "bg-pink-300/30 dark:bg-pink-600/20",

        borderColor: "border-rose-200 dark:border-rose-900/40",
        bgGlow: "bg-rose-500/10 dark:bg-rose-500/20",

        accentBar: "from-rose-600 via-pink-500 to-red-500",
        iconGradient: "from-rose-600 via-pink-500 to-red-500",
        titleGradient: "from-rose-700 via-pink-700 to-slate-900",
        buttonGradient: "from-rose-600 to-pink-600",

        trustBg: "bg-rose-50 dark:bg-rose-950/30",
        trustBorder: "border-rose-100 dark:border-rose-900/40",
        trustMessage:
            "Please sign in again to continue securely.",
    },

    maintenance: {
        icon: Wrench,
        badge: "Scheduled Maintenance",

        title: "Under Maintenance",
        description:
            "We're performing scheduled upgrades. We'll be back shortly!",

        color: "text-purple-600 dark:text-purple-400",
        iconColor: "text-white",

        pageBg: "bg-purple-50 dark:bg-slate-950",
        orb1: "bg-purple-300/30 dark:bg-purple-600/20",
        orb2: "bg-fuchsia-300/30 dark:bg-fuchsia-600/20",

        borderColor: "border-purple-200 dark:border-purple-900/40",
        bgGlow: "bg-purple-500/10 dark:bg-purple-500/20",

        accentBar: "from-purple-600 via-fuchsia-500 to-violet-500",
        iconGradient: "from-purple-600 via-fuchsia-500 to-violet-500",
        titleGradient: "from-purple-700 via-fuchsia-700 to-slate-900",
        buttonGradient: "from-purple-600 to-fuchsia-600",

        trustBg: "bg-purple-50 dark:bg-purple-950/30",
        trustBorder: "border-purple-100 dark:border-purple-900/40",
        trustMessage:
            "We're improving the platform and will be back shortly.",
    },
};