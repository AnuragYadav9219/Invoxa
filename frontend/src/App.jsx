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
            <div className="relative flex h-screen items-center justify-center overflow-hidden bg-slate-950">

              {/* Background Glow */}
              <div className="absolute h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
              <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px]" />
              <div className="relative flex flex-col items-center">

                {/* Animated Spinner */}
                <div className="relative flex items-center justify-center">
                  <div className="h-24 w-24 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
                  <div className="absolute flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-2xl shadow-indigo-500/30">
                    <span className="text-2xl font-bold text-white">
                      I
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="mt-8 bg-linear-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                  Loading Invoxa
                </h2>

                {/* Subtitle */}
                <p className="mt-3 text-sm text-slate-400">
                  Preparing your workspace...
                </p>

                {/* Animated Dots */}
                <div className="mt-6 flex gap-2">
                  <span className="h-3 w-3 animate-bounce rounded-full bg-indigo-500" />
                  <span
                    className="h-3 w-3 animate-bounce rounded-full bg-violet-500"
                    style={{ animationDelay: "0.15s" }}
                  />

                  <span
                    className="h-3 w-3 animate-bounce rounded-full bg-cyan-500"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
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