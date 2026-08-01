import { ErrorBoundary } from "react-error-boundary";
import AppErrorFallback from "./components/AppErrorFallback";

export default function AppErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={AppErrorFallback}
            onError={(error, info) => {
                console.error("Application Error:", error);
                console.error("Component Stack:", info.componentStack);

                // TODO:
                // Send error to Sentry, LogRocket, or your logging service.
            }}
            onReset={() => {
                window.location.reload();
            }}
        >
            {children}
        </ErrorBoundary>
    );
}