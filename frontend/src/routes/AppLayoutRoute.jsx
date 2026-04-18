import Layout from "@/components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppLayoutRoute({ children }) {
    return (
        <ProtectedRoute>
            <Layout>{children}</Layout>
        </ProtectedRoute>
    )
}