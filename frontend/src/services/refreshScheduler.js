import { getExpiryMs } from "@/utils/jwt";
import { tokenService } from "./tokenService";
import { store } from "@/app/store";
import { authApi } from "@/features/auth/authApi";

let timer = null;

export function scheduleSilentRefresh() {
    if (timer) clearTimeout(timer);

    const token = tokenService.getToken();
    const user = tokenService.getUser();

    if (!token || !user || user.deleted) {
        stopSilentRefresh();
        return;
    }

    const exp = getExpiryMs(token);
    const now = Date.now();

    const delay = Math.max(exp - now - 60_000, 5_000);

    timer = setTimeout(async () => {
        try {
            const result = await store
                .dispatch(authApi.endpoints.refresh.initiate())
                .unwrap();

            if (result?.data?.accessToken) {
                scheduleSilentRefresh();
            } else {
                stopSilentRefresh();
            }

        } catch {
            stopSilentRefresh();
        }
    }, delay);
}

export function stopSilentRefresh() {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}