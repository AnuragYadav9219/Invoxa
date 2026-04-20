export const formatCurrency = (amount) =>
    amount != null
        ? Math.round(amount).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        })
        : "-";

export const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export function formatDateInMonth(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export function formatTime(time) {
    if (!time) return "-";

    const date = new Date(time);
    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export const COLORS = [
    "bg-red-100 text-red-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
];

/* ============= UNIT FORMATTOR ============= */
export const formatUnit = (u) => {
    return {
        G: "g",
        KG: "kg",
        TON: "ton",
        BAG: "bag",
        PIECE: "pc",
        CUBIC_FEET: "ft³",
        CUBIC_METER: "m³",
        SQUARE_FEET: "ft²",
        SQUARE_METER: "m²",
    }[u] || u;
};