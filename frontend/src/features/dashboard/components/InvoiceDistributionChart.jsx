import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#22c55e", // Paid
    "#f59e0b", // Pending
    "#3b82f6", // Partially Paid
    "#ef4444", // Overdue
];

export default function InvoiceDistributionChart({ dashboard }) {
    const data = [
        {
            name: "Paid",
            value: dashboard?.paidInvoices ?? 0,
        },
        {
            name: "Pending",
            value: dashboard?.pendingInvoices ?? 0,
        },
        {
            name: "Partially Paid",
            value: dashboard?.partiallyPaidInvoices ?? 0,
        },
        {
            name: "Overdue",
            value: dashboard?.overdueInvoices ?? 0,
        },
    ].filter((item) => item.value > 0);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="rounded-2xl h-full border bg-background p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        Invoice Distribution
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Breakdown of invoices by payment status
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-bold">
                        {dashboard?.totalInvoices ?? 0}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Total Invoices
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={entry.name}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}