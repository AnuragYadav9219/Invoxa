import { FallbackPage } from ".";

export default function MaintenancePage() {
    return (
        <FallbackPage
            variant="maintenance"
            title="Scheduled Maintenance"
            description="We're improving Invoxa. Please check back shortly."
            showRetry={false}
            showHome={false}
        />
    );
}