import { useNavigate } from "react-router-dom";
import { FallbackPage } from ".";

export default function ForbiddenPage() {
    const navigate = useNavigate();

    return (
        <FallbackPage
            variant="unauthorized"
            title="Access Denied"
            description="You don't have permission to access this page."
            actionLabel="Go Back"
            onAction={() => navigate(-1)}
            showRetry={false}
            showHome
        />
    );
}