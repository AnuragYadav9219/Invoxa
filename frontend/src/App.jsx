import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./features/invoice/pages/Invoices";
import InvoiceDetails from "./features/invoice/pages/InvoiceDetails";
import RoleRoute from "./routes/RoleRoute";
import AdminPage from "./features/admin/AdminPage";
import { Toaster } from "sonner";
import { useAutoLogout } from "./hooks/useAutoLogout";
import Login from "./pages/Login";
import Items from "./features/item/pages/Items";
import Trash from "./components/common/Trash";
import Payment from "./features/payment/pages/Payments";
import PaymentDetails from "./features/payment/pages/PaymentDetails";

export default function App() {
  useAutoLogout();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Layout>
                  <Items />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/trash"
            element={
              <ProtectedRoute>
                <Layout>
                  <Trash />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Payment />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["OWNER"]}>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors />
    </>
  );
}