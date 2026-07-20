// import ClassicInvoice from "../templates/ClassicInvoice";
// import CorporateInvoice from "../templates/CorporateInvoice";
// import MinimalInvoice from "../templates/MinimalInvoice";
// import ModernInvoice from "../templates/ModernInvoice";
// import ElectricCyberpunkInvoice from "../templates/ElectricCyberpunkInvoice";
// import NeoBrutalListInvoice from "../templates/NeoBrutalListInvoice";
// import NeonDarkInvoice from "../templates/NeonDarkInvoice";
// import PlayfulRainbowInvoice from "../templates/PlayfulRainbowInvoice";
// import PopRetroCandyInvoice from "../templates/PopRetroCandyInvoice";
// import RoyalInvoice from "../templates/RoyalInvoice";
// import SunriseInvoice from "../templates/SunriseInvoice";
// import TropicalCitrusInvoice from "../templates/TropicalCitrusInvoice";
// import VibrantInvoice from "../templates/VibrantInvoice";

// export default function InvoiceRenderer({ template, data }) {

//     console.time("InvoiceRenderer");

//     const selected = (template || "classic")
//         .trim()
//         .toLowerCase();

//     console.log("Template Selected =", selected);

//     switch (selected) {

//         case "classic":
//             return <ClassicInvoice data={data} />;

//         case "modern":
//             return <ModernInvoice data={data} />;

//         case "minimal":
//             return <MinimalInvoice data={data} />;

//         case "corporate":
//             return <CorporateInvoice data={data} />;

//         case "cyberpunk":
//             return <ElectricCyberpunkInvoice data={data} />;

//         case "neobrutal":
//             return <NeoBrutalListInvoice data={data} />;

//         case "neondark":
//             return <NeonDarkInvoice data={data} />;

//         case "rainbow":
//             return <PlayfulRainbowInvoice data={data} />;

//         case "popretro":
//             return <PopRetroCandyInvoice data={data} />;

//         case "royal":
//             return <RoyalInvoice data={data} />;

//         case "sunrise":
//             return <SunriseInvoice data={data} />;

//         case "tropical":
//             return <TropicalCitrusInvoice data={data} />;

//         case "vibrant":
//             return <VibrantInvoice data={data} />;

//         default:
//             console.warn("Unknown template:", selected);
//             return <ClassicInvoice data={data} />;
//     }
// }














import { lazy, Suspense, useMemo } from "react";

const templates = {
    classic: lazy(() => import("../templates/ClassicInvoice")),
    modern: lazy(() => import("../templates/ModernInvoice")),
    minimal: lazy(() => import("../templates/MinimalInvoice")),
    corporate: lazy(() => import("../templates/CorporateInvoice")),
    cyberpunk: lazy(() => import("../templates/ElectricCyberpunkInvoice")),
    neobrutal: lazy(() => import("../templates/NeoBrutalListInvoice")),
    neondark: lazy(() => import("../templates/NeonDarkInvoice")),
    rainbow: lazy(() => import("../templates/PlayfulRainbowInvoice")),
    popretro: lazy(() => import("../templates/PopRetroCandyInvoice")),
    royal: lazy(() => import("../templates/RoyalInvoice")),
    sunrise: lazy(() => import("../templates/SunriseInvoice")),
    tropical: lazy(() => import("../templates/TropicalCitrusInvoice")),
    vibrant: lazy(() => import("../templates/VibrantInvoice")),
};

export default function InvoiceRenderer({ template, data }) {

    const selected = (template || "classic").trim().toLowerCase();

    const Template = useMemo(
        () => templates[selected] || templates.classic,
        [selected]
    );

    return (
        <Suspense fallback={<div>Loading template...</div>}>
            <Template data={data} />
        </Suspense>
    );
}