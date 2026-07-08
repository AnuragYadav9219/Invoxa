import {
    FileText,
    Sparkles,
    Briefcase,
    Minus,
    Cpu,
    Palette,
    Zap,
    Layers,
    Rainbow,
    Music4,
    Sun,
    Crown,
    Citrus,
} from "lucide-react";

import ClassicInvoice from "@/features/invoice/templates/ClassicInvoice";
import ModernInvoice from "@/features/invoice/templates/ModernInvoice";
import CorporateInvoice from "@/features/invoice/templates/CorporateInvoice";
import MinimalInvoice from "@/features/invoice/templates/MinimalInvoice";
import VibrantInvoice from "@/features/invoice/templates/VibrantInvoice";
import ElectricCyberpunkInvoice from "@/features/invoice/templates/ElectricCyberpunkInvoice";
import NeonDarkInvoice from "@/features/invoice/templates/NeonDarkInvoice";
import NeoBrutalListInvoice from "@/features/invoice/templates/NeoBrutalListInvoice";
import PlayfulRainbowInvoice from "@/features/invoice/templates/PlayfulRainbowInvoice";
import PopRetroCandyInvoice from "@/features/invoice/templates/PopRetroCandyInvoice";
import SunriseInvoice from "@/features/invoice/templates/SunriseInvoice";
import RoyalInvoice from "@/features/invoice/templates/RoyalInvoice";
import TropicalCitrusInvoice from "@/features/invoice/templates/TropicalCitrusInvoice";

export const templateData = [
    {
        id: "classic",
        name: "Classic",
        description: "A timeless layout designed for traditional business invoicing.",
        icon: FileText,
        component: ClassicInvoice,
    },
    {
        id: "modern",
        name: "Modern",
        description: "A clean, contemporary design with a minimal professional look.",
        icon: Sparkles,
        component: ModernInvoice,
    },
    {
        id: "corporate",
        name: "Corporate",
        description: "A polished business template ideal for companies and enterprises.",
        icon: Briefcase,
        component: CorporateInvoice,
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "A distraction-free layout focused on clarity and simplicity.",
        icon: Minus,
        component: MinimalInvoice,
    },
    {
        id: "cyberpunk",
        name: "Cyberpunk",
        description: "A futuristic dark theme featuring bold neon-inspired styling.",
        icon: Cpu,
        component: ElectricCyberpunkInvoice,
    },
    {
        id: "vibrant",
        name: "Vibrant",
        description: "A colorful and energetic design that stands out instantly.",
        icon: Palette,
        component: VibrantInvoice,
    },
    {
        id: "neonDark",
        name: "Neon Dark",
        description: "A premium dark interface enhanced with glowing neon accents.",
        icon: Zap,
        component: NeonDarkInvoice,
    },
    {
        id: "neonBrutal",
        name: "Neon Brutal",
        description: "A bold brutalist design with high-contrast modern aesthetics.",
        icon: Layers,
        component: NeoBrutalListInvoice,
    },
    {
        id: "rainbow",
        name: "Playful Rainbow",
        description: "A cheerful multi-color design perfect for creative businesses.",
        icon: Rainbow,
        component: PlayfulRainbowInvoice,
    },
    {
        id: "popRetro",
        name: "Pop Retro",
        description: "A nostalgic retro-inspired layout with vibrant vintage colors.",
        icon: Music4,
        component: PopRetroCandyInvoice,
    },
    {
        id: "sunrise",
        name: "Sunrise",
        description: "A warm and elegant theme inspired by soft sunrise tones.",
        icon: Sun,
        component: SunriseInvoice,
    },
    {
        id: "royal",
        name: "Royal",
        description: "A luxurious template featuring refined typography and premium styling.",
        icon: Crown,
        component: RoyalInvoice,
    },
    {
        id: "tropical",
        name: "Tropical Citrus",
        description: "A fresh tropical design with bright citrus-inspired colors.",
        icon: Citrus,
        component: TropicalCitrusInvoice,
    },
];