import { toast } from "sonner";
import { toastTypes } from "./toastTypes";

/* ================= SUCCESS ================= */
export const showSuccess = (message, options = {}) => {
    toast.success(message, {
        ...toastTypes.success,
        ...options,
    });
};

/* ================= ERROR ================= */
export const showError = (message, options = {}) => {
    toast.error(message, {
        id: message,
        ...toastTypes.error,
        ...options,
    });
};

/* ================= WARNING ================= */
export const showWarning = (message, options = {}) => {
    toast.warning(message, {
        ...toastTypes.warning,
        ...options,
    });
};

/* ================= INFO ================= */
export const showInfo = (message, options = {}) => {
    toast(message, {
        ...toastTypes.info,
        ...options,
    });
};

/* ================= LOADING ================= */
export const showLoading = (message = "Loading...") => {
    return toast.loading(message, {
        ...toastTypes.loading,
    });
};

/* ================= PROMISE TOAST ================= */
export const showPromise = (promise, messages) => {
    return toast.promise(promise, {
        loading: messages.loading || "Loading...",
        success: messages.success || "Success",
        error: messages.error || "Something went wrong",
    });
};

/* ================= DISMISS ================= */
export const dismissToast = (id) => {
    toast.dismiss(id);
};

/* ============= SHOW ERROR WITH RETRY ============= */
export const showErrorWithRetry = (message, onRetry) => {
    toast.error(message, {
        action: {
            label: "Retry",
            onClick: onRetry,
        },
    });
};