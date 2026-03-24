import InvoiceTable from "@/components/invoice/InvoiceTable";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, AlertTriangle, FileText } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total" value="120" icon={<FileText />} />
                <StatCard title="Paid" value="80" icon={<DollarSign />} color="green" />
                <StatCard title="Pending" value="25" icon={<Clock />} color="yellow" />
                <StatCard title="Overdue" value="15" icon={<AlertTriangle />} color="red" />
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Invoices
                    </h2>

                    <InvoiceTable limit={5} showActions={false} />
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 flex items-center justify-between">

                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h2 className="text-2xl font-bold">{value}</h2>
                </div>

                <div className={`p-3 rounded-full ${colors[color] || "bg-gray-100"}`}>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}