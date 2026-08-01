import { FallbackPage } from ".";

export default function EmptyState({
    title = "Nothing Here",
    description = "No data is available yet.",
    actionLabel,
    onAction,
    showHome = true,
    varient = "empty"
}) {
    return (
        <FallbackPage
            variant={varient}
            title={title}
            description={description}
            showRetry={false}
            showBack={false}
            showHome={showHome}
            actionLabel={actionLabel}
            onAction={onAction}
        />
    );
}