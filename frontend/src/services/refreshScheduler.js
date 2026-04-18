import { getExpiryMs } from "@/utils/jwt";
import { tokenService } from "./tokenService";
import { store } from "@/app/store";
import { authApi } from "@/features/auth/authApi";

let timer = null;

export function scheduleSilentRefresh() {
    if (timer) clearTimeout(timer);

    const token = tokenService.getToken();
    if (!token) return;

    const exp = getExpiryMs(token);
    const now = Date.now();

    const delay = Math.max(exp - now - 60_000, 5_000);

    timer = setTimeout(async () => {
        try {
            await store.dispatch(authApi.endpoints.refresh.initiate()).unwrap();
            scheduleSilentRefresh();
        } catch {
            // refresh failed -> authSlice will handle logout
        }
    }, delay);
}

export function stopSilentRefresh() {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}