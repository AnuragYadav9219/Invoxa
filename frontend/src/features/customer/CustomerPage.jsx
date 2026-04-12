// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetCustomerSummaryQuery } from "@/features/invoice/invoiceApi";

// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import CustomerTable from "./components/CustomerTable";
// import CustomerCard from "./components/CustomerCard";

// export default function CustomerPage() {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");

//   const { data: customers = [], isLoading, isFetching } =
//     useGetCustomerSummaryQuery();

//   const filtered = customers.filter((c) =>
//     c.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="space-y-6 pt-2">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
//         <p className="text-sm text-gray-600">
//           Manage and track all your customers
//         </p>
//       </div>

//       {/* SUMMARY */}
//       <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-3 shadow-sm">
//         <div className="flex items-center gap-4 text-sm text-gray-600">
//           <span>
//             <strong>{filtered.length}</strong> customers
//           </span>

//           {isFetching && (
//             <span className="flex items-center gap-2 text-gray-500">
//               <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//               Syncing...
//             </span>
//           )}
//         </div>

//         <div className="text-sm text-gray-400">
//           Click to view invoices
//         </div>
//       </div>

//       {/* GRADIENT BORDER (FIXED) */}
//       <div className="p-[1.5px] rounded-3xl bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">

//         <div className=" rounded-3xl shadow-sm overflow-hidden">

//           {/* SEARCH */}
//           <div className="p-4 border-b">
//             <div className="relative w-full md:max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

//               <Input
//                 placeholder="Search customers..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9 rounded-full bg-gray-50 focus:bg-white"
//               />
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="p-2">

//             {/* DESKTOP */}
//             <CustomerTable
//               customers={filtered}
//               isLoading={isLoading}
//               navigate={navigate}
//             />

//             {/* TABLET */}
//             <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 p-4">
//               {filtered.map((c, i) => (
//                 <CustomerCard key={i} customer={c} navigate={navigate} />
//               ))}
//             </div>

//             {/* MOBILE */}
//             <div className="block md:hidden space-y-4 p-4">
//               {filtered.map((c, i) => (
//                 <CustomerCard key={i} customer={c} navigate={navigate} isMobile />
//               ))}
//             </div>

//           </div>

//           {/* LOADING */}
//           {isFetching && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
//               <div className="flex flex-col items-center gap-2">
//                 <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//                 <p className="text-xs text-gray-500">Updating data...</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCustomerSummaryQuery } from "@/features/invoice/invoiceApi";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CustomerTable from "./components/CustomerTable";
import CustomerCard from "./components/CustomerCard";

export default function CustomerPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading, isFetching } =
    useGetCustomerSummaryQuery();

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-2">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-sm text-gray-600">
          Manage and track all your customers
        </p>
      </div>

      {/* SUMMARY */}
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            <strong>{filtered.length}</strong> customers
          </span>

          {isFetching && (
            <span className="flex items-center gap-2 text-gray-500">
              <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Syncing...
            </span>
          )}
        </div>

        <div className="text-sm text-gray-400">
          Click to view invoices
        </div>
      </div>

      {/* GRADIENT BORDER (FIXED) */}
      <div className="p-[1.5px] rounded-3xl bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          {/* SEARCH */}
          <div className="p-4 border-b">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="p-2">

            {/* DESKTOP */}
            <CustomerTable
              customers={filtered}
              isLoading={isLoading}
              navigate={navigate}
            />

            {/* TABLET */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 p-4">
              {filtered.map((c, i) => (
                <CustomerCard key={i} customer={c} navigate={navigate} />
              ))}
            </div>

            {/* MOBILE */}
            <div className="block md:hidden space-y-4 p-4">
              {filtered.map((c, i) => (
                <CustomerCard key={i} customer={c} navigate={navigate} isMobile />
              ))}
            </div>

          </div>

          {/* LOADING */}
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500">Updating data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}