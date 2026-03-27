import { errorMap } from "./errorMap";

export const getErrorMessage = (status, feature, backendMessage) => {
    return (
        backendMessage ||
        errorMap?.[feature]?.[status] ||
        errorMap?.common?.[status] ||
        "Something went wrong"
    );
};