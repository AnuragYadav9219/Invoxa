import { useNavigate } from "react-router-dom";
import { FallbackPage } from ".";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <FallbackPage
            variant="unauthorized"
            title="Session Expired"
            description="Please sign in again to continue using Invoxa."
            actionLabel="Sign In"
            onAction={() => navigate("/login")}
            showRetry={false}
            showHome={false}
        />
    );
}