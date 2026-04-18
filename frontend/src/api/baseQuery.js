import { getErrorMessage } from "@/components/toast/getErrorMessage";
import { showError, showWarning } from "@/components/toast/toast";
import { deviceService } from "@/services/deviceService";
import { tokenService } from "@/services/tokenService";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  timeout: 10000,
});

/* ================= HELPER: FORCE LOGOUT ================= */
function forceLogout() {
  tokenService.clear();
  localStorage.removeItem("shopId");

  showWarning("Session expired. Please login again.");

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

/* ================= BASE QUERY ================= */
export const axiosBaseQuery =
  () =>
  async ({ url, method, body, params, responseType, meta }) => {
    if (!url) {
      console.error("Missing URL in API call");
      return { error: { status: 400, data: "Invalid API URL" } };
    }

    try {
      const token = tokenService.getToken();
      const shopId = localStorage.getItem("shopId");

      const result = await axiosInstance({
        url,
        method,
        data: body,
        params,
        responseType,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(shopId && { "X-Shop-Id": shopId }),
          "X-Device-Id": deviceService.getDeviceId(),
        },
      });

      return { data: result.data };

    } catch (error) {
      const status = error.response?.status;

      /* ================= HANDLE 401 & 403 ================= */
      if ((status === 401 || status === 403) && !meta?.retry) {
        try {
          const refreshResponse = await axiosInstance.post("/auth/refresh");

          const res = refreshResponse.data?.data;

          tokenService.setToken(res.accessToken);
          tokenService.setUser(res.user);
          localStorage.setItem("shopId", res.user.shopId);

          const retryResult = await axiosInstance({
            url,
            method,
            data: body,
            params,
            responseType,
            headers: {
              Authorization: `Bearer ${res.accessToken}`,
              "X-Shop-Id": res.user.shopId,
              "X-Device-Id": deviceService.getDeviceId(),
            },
          });

          return { data: retryResult.data };

        } catch (refreshError) {
          forceLogout();

          return {
            error: {
              status: 401,
              data: "Session expired",
            },
          };
        }
      }

      /* ================= GLOBAL ERROR ================= */
      const feature = meta?.feature || "common";

      const message = getErrorMessage(
        status,
        feature,
        error.response?.data?.message
      );

      showError(message, { id: message });

      return {
        error: {
          status,
          data: error.response?.data || error.message,
        },
      };
    }
  };