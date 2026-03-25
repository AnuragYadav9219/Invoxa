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