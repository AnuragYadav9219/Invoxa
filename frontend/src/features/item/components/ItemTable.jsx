import ItemRow from "./ItemRow";
import ItemCard from "./ItemCard";

export default function ItemTable({ items, isLoading, onEdit }) {

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">No items found</p>
                <p className="text-sm text-gray-400 mt-1">
                    Add your first item 
                </p>
            </div>
        );
    }

    return (
        <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block w-full">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
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

            {/* MOBILE CARDS */}
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
