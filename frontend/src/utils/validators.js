export const validate = (form) => {
    if (!form.current) {
        return "Current password is required";
    }

    if (!form.newPass) {
        return "New password is required";
    }

    if (form.newPass.length < 6) {
        return "Password must be at least 6 characters";
    }

    if (!form.confirm) {
        return "Please confirm your password";
    }

    if (form.newPass !== form.confirm) {
        return "Passwords do not match";
    }

    return null;
};