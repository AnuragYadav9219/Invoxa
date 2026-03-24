import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layout/Layout";
import InvoiceDetails from "./pages/InvoiceDetails";
import Invoices from "./pages/Invoices";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />

          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </PrivateRoute>
            } />

          <Route
            path="/invoices/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <InvoiceDetails />
                </Layout>
              </PrivateRoute>
            } />
        </Routes>

      </BrowserRouter>

      <Toaster position="top-right" richColors />
    </>
  );
}