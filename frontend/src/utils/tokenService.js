export const tokenService = {
    getToken: () => localStorage.getItem("token"),
    setToken: (token) => localStorage.setItem("token", token),
    removeToken: () => localStorage.removeItem("token"),

    getUser: () => JSON.parse(localStorage.getItem("user")),
    setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),

    clear: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};