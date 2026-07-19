import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

const AppLayoutRoute = lazy(() => import("./routes/AppLayoutRoute"));
const RoleRoute = lazy(() => import("./routes/RoleRoute"));

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AuthOtpPage = lazy(() => import("./pages/AuthOtpPage"));

const RecoverPage = lazy(() =>
  import("./features/user/component/RecoveryPage")
);

const SettingsPage = lazy(() =>
  import("./features/user/component/tabs/SettingsPage")
);

const UserProfile = lazy(() =>
  import("./features/user/pages/UserProfile")
);

const Invoices = lazy(() =>
  import("./features/invoice/pages/Invoices")
);

const InvoiceDetails = lazy(() =>
  import("./features/invoice/pages/InvoiceDetails")
);

const InvoicePdfPage = lazy(() =>
  import("./features/invoice/pages/InvoicePdfPage")
);

const Items = lazy(() =>
  import("./features/item/pages/Items")
);

const Trash = lazy(() =>
  import("./components/common/Trash")
);

const Payment = lazy(() =>
  import("./features/payment/pages/Payments")
);

const PaymentDetails = lazy(() =>
  import("./features/payment/pages/PaymentDetails")
);

const CustomerPayment = lazy(() =>
  import("./features/payment/pages/CustomerPayment")
);

const PaymentSuccess = lazy(() =>
  import("./features/payment/pages/PaymentSuccess")
);

const PaymentFailed = lazy(() =>
  import("./features/payment/pages/PaymentFailed")
);

const CustomerPage = lazy(() =>
  import("./features/customer/CustomerPage")
);

const CustomerDetailsPage = lazy(() =>
  import("./features/customer/CustomerDetailsPage")
);

const Notifications = lazy(() =>
  import("./features/notification/pages/Notifications")
);

const NotificationDetail = lazy(() =>
  import("./features/notification/components/NotificationDetail")
);

const AdminPage = lazy(() =>
  import("./features/admin/AdminPage")
);

export default function App() {
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
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              Loading...
            </div>
          }
        >
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-otp" element={<AuthOtpPage />} />
            <Route path="/recover" element={<RecoverPage />} />
            <Route path="/pdf/:invoiceId" element={<InvoicePdfPage />} />
            <Route path="/pay/:paymentToken" element={<CustomerPayment />} />

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
            <Route path="/payment/success" element={<AppLayoutRoute><PaymentSuccess /></AppLayoutRoute>} />
            <Route path="/payment/failed" element={<AppLayoutRoute><PaymentFailed /></AppLayoutRoute>} />

            <Route path="/customers" element={<AppLayoutRoute><CustomerPage /></AppLayoutRoute>} />
            <Route path="/customers/:name" element={<AppLayoutRoute><CustomerDetailsPage /></AppLayoutRoute>} />

            <Route path="/notifications" element={<AppLayoutRoute><Notifications /></AppLayoutRoute>} />
            <Route path="/notifications/:id" element={<AppLayoutRoute><NotificationDetail /></AppLayoutRoute>} />

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
        </Suspense>
      </BrowserRouter>
    </>
  );
}