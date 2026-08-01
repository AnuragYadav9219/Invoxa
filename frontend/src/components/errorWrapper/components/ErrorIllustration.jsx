import {
    AlertTriangle,
    Inbox,
    WifiOff,
    Clock3,
    ShieldAlert,
    Wrench,
} from "lucide-react";

const variants = {
    server: {
        icon: AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-950/40",
    },
    network: {
        icon: WifiOff,
        color: "text-orange-500",
        bg: "bg-orange-100 dark:bg-orange-950/40",
    },
    timeout: {
        icon: Clock3,
        color: "text-yellow-500",
        bg: "bg-yellow-100 dark:bg-yellow-950/40",
    },
    empty: {
        icon: Inbox,
        color: "text-indigo-500",
        bg: "bg-indigo-100 dark:bg-indigo-950/40",
    },
    unauthorized: {
        icon: ShieldAlert,
        color: "text-rose-500",
        bg: "bg-rose-100 dark:bg-rose-950/40",
    },
    maintenance: {
        icon: Wrench,
        color: "text-purple-500",
        bg: "bg-purple-100 dark:bg-purple-950/40",
    },
};

export default function ErrorIllustration({ variant = "server" }) {
    const config = variants[variant] || variants.server;
    const Icon = config.icon;

    return (
        <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${config.bg}`}
        >
            <Icon className={config.color} size={46} />
        </div>
    );
}