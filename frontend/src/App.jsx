import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import AppLayoutRoute from "./routes/AppLayoutRoute";
import RoleRoute from "./routes/RoleRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SettingsPage from "./features/user/component/SettingsPage";
import UserProfile from "./features/user/pages/UserProfile";

import Invoices from "./features/invoice/pages/Invoices";
import InvoiceDetails from "./features/invoice/pages/InvoiceDetails";
import Items from "./features/item/pages/Items";
import Trash from "./components/common/Trash";
import Payment from "./features/payment/pages/Payments";
import PaymentDetails from "./features/payment/pages/PaymentDetails";
import CustomerPage from "./features/customer/CustomerPage";
import CustomerDetailsPage from "./features/customer/CustomerDetailsPage";
import AdminPage from "./features/admin/AdminPage";

import { useAutoLogout } from "./hooks/useAutoLogout";
import { useEffect } from "react";

export default function App() {
  useAutoLogout();

  useEffect(() => {
    const handleWheel = (event) => {
      const active = document.activeElement;

      if (active && active.type === "number") {
        active.blur();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route path="/dashboard" element={<AppLayoutRoute><Dashboard /></AppLayoutRoute>} />
          <Route path="/settings" element={<AppLayoutRoute><SettingsPage /></AppLayoutRoute>} />
          <Route path="/profile" element={<AppLayoutRoute><UserProfile /></AppLayoutRoute>} />

          <Route path="/invoices" element={<AppLayoutRoute><Invoices /></AppLayoutRoute>} />
          <Route path="/invoices/:id" element={<AppLayoutRoute><InvoiceDetails /></AppLayoutRoute>} />

          <Route path="/items" element={<AppLayoutRoute><Items /></AppLayoutRoute>} />
          <Route path="/trash" element={<AppLayoutRoute><Trash /></AppLayoutRoute>} />

          <Route path="/payments" element={<AppLayoutRoute><Payment /></AppLayoutRoute>} />
          <Route path="/payments/:id" element={<AppLayoutRoute><PaymentDetails /></AppLayoutRoute>} />

          <Route path="/customers" element={<AppLayoutRoute><CustomerPage /></AppLayoutRoute>} />
          <Route path="/customers/:name" element={<AppLayoutRoute><CustomerDetailsPage /></AppLayoutRoute>} />

          {/* ROLE BASED */}
          <Route
            path="/admin"
            element={
              <AppLayoutRoute>
                <RoleRoute allowedRoles={["OWNER"]}>
                  <AdminPage />
                </RoleRoute>
              </AppLayoutRoute>
            }
          />

        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors />
    </>
  );
}