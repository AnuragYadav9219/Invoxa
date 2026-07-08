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

/* ================= FORCE LOGOUT ================= */
function forceLogout() {
  if (window.location.pathname.startsWith("/pdf")) {
    return;
  }

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
      return { error: { status: 400, data: "Invalid API URL" } };
    }

    try {
      const token = tokenService.getToken();
      const shopId = localStorage.getItem("shopId");

      const searchParams = new URLSearchParams(window.location.search);
      const printToken = searchParams.get("token");

      const result = await axiosInstance({
        url,
        method,
        data: body,
        params,
        responseType,
        headers: {
          ...(printToken 
            ? { "X-Print-Token" : printToken}
            : token
            ? {Authorization: `Bearer ${token}`}
            : {}
          ),

          // ...(token && { Authorization: `Bearer ${token}` }),
          ...(shopId && { "X-Shop-Id": shopId }),
          "X-Device-Id": deviceService.getDeviceId(),
        },
      });

      return { data: result.data };

    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      const code = errorData?.code;

      /* ================= SAFETY: NO URL ================= */
      if (!url) {
        return {
          error: {
            status,
            data: errorData || "Invalid request",
          },
        };
      }

      /* ================= ACCOUNT DELETED ================= */
      if (code === "ACCOUNT_DELETED") {
        return {
          error: {
            status: 403,
            data: errorData,
          },
        };
      }

      /* ================= SKIP REFRESH (AUTH FLOWS) ================= */
      const isAuthFlow =
        url.includes("/auth/") ||
        url.includes("/recover") ||
        url.includes("/send-otp") ||
        url.includes("/verify-otp") ||
        url.includes("/delete");

      if (isAuthFlow || meta?.skipAuth) {
        return {
          error: {
            status,
            data: errorData || error.message,
          },
        };
      }

      /* ================= REFRESH (ONLY PROTECTED APIs) ================= */
      if ((status === 401 || status === 403) && !meta?.retry) {
        try {
          const refreshResponse = await axiosInstance.post("/auth/refresh");

          const res = refreshResponse.data?.data;

          if (!res?.accessToken) {
            throw new Error("Invalid refresh response");
          }

          // Save new tokens
          tokenService.setToken(res.accessToken);
          tokenService.setUser(res.user);
          localStorage.setItem("shopId", res.user.shopId);

          // Retry original request
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
        errorData?.message
      );

      showError(message, { id: message });

      return {
        error: {
          status,
          data: errorData || error.message,
        },
      };
    }
  };