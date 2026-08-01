import { getErrorMessage } from "../toast/getErrorMessage";
import {
    ServerErrorPage,
    UnauthorizedPage,
    ForbiddenPage,
    NetworkErrorPage,
    MaintenancePage,
    NotFoundPage,
} from "./components";

export default function ApiErrorPage({
    error,
    retry,
    feature = "common",
}) {
    if (!error) return null;
    console.log("ApiErrorPage: ", error.status);

    const status = error.status;

    const enhancedError = {
        ...error,
        data: {
            ...(error.data || {}),
            message: getErrorMessage(
                status,
                feature,
                error.data?.message
            ),
        },
    };

    switch (status) {
        case 401:
            return <UnauthorizedPage />;

        case 403:
            return <ForbiddenPage />;

        case 404:
            return <NotFoundPage />;

        case 503:
            return <MaintenancePage retry={retry} />;

        case "FETCH_ERROR":
        case "TIMEOUT_ERROR":
            return (
                <NetworkErrorPage
                    error={enhancedError}
                    retry={retry}
                />
            );

        default:
            return (
                <ServerErrorPage
                    error={enhancedError}
                    retry={retry}
                />
            );
    }
}