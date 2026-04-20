import ItemRow from "./ItemRow";
import ItemCard from "./ItemCard";

export default function ItemTable({ items = [], isLoading, onEdit }) {

    /* ================= LOADING ================= */
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-14 bg-gray-200 animate-pulse rounded-lg"
                    />
                ))}
            </div>
        );
    }

    /* ================= EMPTY ================= */
    if (!items.length) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-600 font-medium">No items found</p>
                <p className="text-sm text-gray-400 mt-1">
                    Add your first item to start billing
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full text-sm border rounded-xl overflow-hidden">

                    <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Units</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y bg-white">
                        {items.map((item) => (
                            <ItemRow
                                key={item.id}
                                item={item}
                                onEdit={onEdit}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="grid md:hidden gap-4">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </>
    );
}