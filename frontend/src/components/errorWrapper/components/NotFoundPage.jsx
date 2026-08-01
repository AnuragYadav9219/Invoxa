import { useNavigate } from "react-router-dom";
import { FallbackPage } from ".";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <FallbackPage
            variant="empty"
            title="404 - Page Not Found"
            description="The page you're looking for doesn't exist or may have been moved."
            actionLabel="Go Back"
            onAction={() => navigate(-1)}
            showRetry={false}
            showHome
        />
    );
}