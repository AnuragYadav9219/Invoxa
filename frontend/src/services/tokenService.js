export const tokenService = {
    getToken: () => localStorage.getItem("token"),
    setToken: (token) => localStorage.setItem("token", token),
    removeToken: () => localStorage.removeItem("token"),

    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setRefreshToken: (token) => {
        localStorage.setItem("refreshToken", token);
    },
    removeRefreshToken: () => {
        localStorage.removeItem("refreshToken");
    },

    getUser: () => {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
    },

    removeUser: () => {
        localStorage.removeItem("user");
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },

    clear: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },
};