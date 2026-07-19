import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";

import { store } from "./app/store";
import InvoicePdfPage from "./features/invoice/pages/InvoicePdfPage";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <InvoicePdfPage />
        </Provider>
    </StrictMode>
)