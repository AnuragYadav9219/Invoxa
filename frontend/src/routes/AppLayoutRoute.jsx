import Layout from "@/components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import { useAutoLogout } from "@/hooks/useAutoLogout";

export default function AppLayoutRoute({ children }) {
    useAutoLogout();

    return (
        <ProtectedRoute>
            <Layout>{children}</Layout>
        </ProtectedRoute>
    )
}