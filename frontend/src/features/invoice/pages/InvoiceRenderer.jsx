import ClassicInvoice from "../templates/ClassicInvoice";
import CorporateInvoice from "../templates/CorporateInvoice";
import MinimalInvoice from "../templates/MinimalInvoice";
import ModernInvoice from "../templates/ModernInvoice";
import ElectricCyberpunkInvoice from "../templates/ElectricCyberpunkInvoice";
import NeoBrutalListInvoice from "../templates/NeoBrutalListInvoice";
import NeonDarkInvoice from "../templates/NeonDarkInvoice";
import PlayfulRainbowInvoice from "../templates/PlayfulRainbowInvoice";
import PopRetroCandyInvoice from "../templates/PopRetroCandyInvoice";
import RoyalInvoice from "../templates/RoyalInvoice";
import SunriseInvoice from "../templates/SunriseInvoice";
import TropicalCitrusInvoice from "../templates/TropicalCitrusInvoice";
import VibrantInvoice from "../templates/VibrantInvoice";

export default function InvoiceRenderer({ template, data }) {
    switch (template) {
        case 'classic':
            return <ClassicInvoice data={data} />;

        case 'modern':
            return <ModernInvoice data={data} />;

        case 'minimal':
            return <MinimalInvoice data={data} />;

        case 'corporate':
            return <CorporateInvoice data={data} />;

        case 'cyberpunk':
            return <ElectricCyberpunkInvoice data={data} />;

        case 'neoBrutal':
            return <NeoBrutalListInvoice data={data} />;

        case 'neonDark':
            return <NeonDarkInvoice data={data} />;

        case 'rainbow':
            return <PlayfulRainbowInvoice data={data} />;

        case 'popRetro':
            return <PopRetroCandyInvoice data={data} />;

        case 'royal':
            return <RoyalInvoice data={data} />;

        case 'sunrise':
            return <SunriseInvoice data={data} />;

        case 'tropical':
            return <TropicalCitrusInvoice data={data} />;

        case 'vibrant':
            return <VibrantInvoice data={data} />;

        default:
            return <ClassicInvoice data={data} />;
    }
}