import { FallbackPage } from ".";

export default function AppErrorFallback({
    error,
    resetErrorBoundary,
}) {
    return (
        <FallbackPage
            variant="server"
            title="Application Error"
            description={
                error?.message ||
                "Something unexpected happened while rendering the application."
            }
            actionLabel="Reload"
            onAction={resetErrorBoundary}
            showRetry={false}
            errorDetails={error}
        />
    );
}