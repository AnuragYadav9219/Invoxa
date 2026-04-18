const DEVICE_ID_KEY = "deviceId";

export const deviceService = {
    getDeviceId() {
        let id = localStorage.getItem(DEVICE_ID_KEY);

        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(DEVICE_ID_KEY, id);
        }

        return id;
    },

    getDeviceName() {
        const ua = navigator.userAgent;

        let browser = "Unknown";
        let os = "Unknown";

        /* ============= BROWSER DETECTION ============ */
        if (ua.includes("Chrome")) browser = "Chrome";
        if (ua.includes("Firefox")) browser = "Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        if (ua.includes("Edg")) browser = "Edg";

        /* ============ OS DETECTION =============== */
        if (ua.includes("Windows")) os = "Windows";
        if (ua.includes("Mac")) os = "Mac";
        if (ua.includes("Android")) os = "Android";
        if (ua.includes("iPhone")) os = "iPhone";

        const isMobile = /Mobi|Android/i.test(ua);

        return `${os} • ${browser} ${isMobile ? "(Mobile)" : "(Desktop)"}`;
    }
}