
import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { Toaster } from "react-hot-toast";

import App from "./App";
import theme from "./themes/theme";
import store from "./app/store";

import "./styles/index.css";

// =====================================================
// ROOT RENDER
// =====================================================

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>

        {/* =================================================
            REDUX PROVIDER
        ================================================= */}

        <Provider store={store}>

            {/* =================================================
                MATERIAL UI THEME
            ================================================= */}

            <ThemeProvider theme={theme}>

                <CssBaseline />

                {/* =================================================
                    ROUTER
                ================================================= */}

                <BrowserRouter>

                    <App />

                </BrowserRouter>

                {/* =================================================
                    GLOBAL TOAST NOTIFICATIONS
                ================================================= */}

                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={10}
                    toastOptions={{
                        duration: 3000,

                        style: {
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: 500,
                        },

                        success: {
                            duration: 3000,
                        },

                        error: {
                            duration: 4000,
                        },
                    }}
                />

            </ThemeProvider>

        </Provider>

    </React.StrictMode>
);

