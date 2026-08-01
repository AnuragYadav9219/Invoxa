import { isRejectedWithValue } from "@reduxjs/toolkit";
import { setGlobalError } from "./errorSlice";

export const apiErrorMiddleware =
    ({ dispatch }) =>
        (next) =>
            (action) => {
                if (isRejectedWithValue(action)) {
                    const error = action.payload;
                    const status = error?.status;

                    if (
                        status === "FETCH_ERROR" ||
                        status === "TIMEOUT_ERROR" ||
                        status >= 500
                    ) {
                        dispatch(setGlobalError(error));
                    }
                }

                return next(action);
                ;
            }