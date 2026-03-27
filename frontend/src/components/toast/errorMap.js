export const errorMap = {
    common: {
        400: "Invalid request",
        401: "Unauthorized access",
        403: "Access denied",
        404: "Resource not found",
        500: "Server error",
    },

    auth: {
        400: "Invalid email or password",
        401: "Session expired. Please login again.",
    },

    invoice: {
        400: "Invalid invoice data",
        404: "Invoice not found",
        409: "Invoice conflict occurred",
    },
};