// src/api/interceptors.js

// =====================================================
// SETUP AXIOS INTERCEPTORS
// =====================================================

const setupInterceptors = (api) => {
    // =================================================
    // REQUEST INTERCEPTOR
    // =================================================

    api.interceptors.request.use(
        (config) => {
            // -----------------------------------------
            // GET TOKEN
            // -----------------------------------------

            const token = localStorage.getItem("token");

            // -----------------------------------------
            // INITIALIZE HEADERS
            // -----------------------------------------

            config.headers = config.headers || {};

            // -----------------------------------------
            // ACCEPT HEADER
            // -----------------------------------------

            config.headers.Accept = "application/json";

            // -----------------------------------------
            // AUTHORIZATION
            // -----------------------------------------
if (token) {
    config.headers.Authorization = `Bearer ${token}`;
}

            // -----------------------------------------
            // CONTENT TYPE
            // -----------------------------------------

            if (config.data instanceof FormData) {
                /*
                 * Do not manually set multipart/form-data.
                 *
                 * Browser will automatically add:
                 *
                 * Content-Type:
                 * multipart/form-data; boundary=...
                 */

                delete config.headers["Content-Type"];
            } else {
                config.headers["Content-Type"] =
                    "application/json";
            }

            return config;
        },

        (error) => {
            return Promise.reject(error);
        }
    );

    // =================================================
    // RESPONSE INTERCEPTOR
    // =================================================

    api.interceptors.response.use(
        // =================================================
        // SUCCESS
        // =================================================

        (response) => {
            return response;
        },

        // =================================================
        // ERROR
        // =================================================

        (error) => {
            // -----------------------------------------
            // SERVER RESPONSE
            // -----------------------------------------

            if (error.response) {
                const status = error.response.status;

                const data = error.response.data;

                const config = error.config;

                console.error("API ERROR:", {
                    status,
                    data,
                    url: config?.url,
                    method:
                        config?.method?.toUpperCase(),
                });

                // =====================================
                // 401 - UNAUTHORIZED
                // =====================================

             if (status === 401) {
    console.error(
        "401 Unauthorized. Token may be missing, invalid, or expired."
    );

    console.error(
        "Current token exists:",
        !!localStorage.getItem("token")
    );

    // Keep the existing logout behavior for now
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    if (
        window.location.pathname !== "/login"
    ) {
        window.location.href = "/login";
    }
}

                // =====================================
                // 403 - FORBIDDEN
                // =====================================

                if (status === 403) {
                    console.error(
                        "Forbidden:",
                        data?.message ||
                            "You are not authorized to perform this action."
                    );
                }

                // =====================================
                // 404 - NOT FOUND
                // =====================================

                if (status === 404) {
                    console.error(
                        "Not Found:",
                        data?.message ||
                            "Requested resource was not found."
                    );
                }

                // =====================================
                // 422 - VALIDATION ERROR
                // =====================================

                if (status === 422) {
                    console.error(
                        "Validation Error:",
                        data?.errors ||
                            data?.message ||
                            "Validation failed."
                    );
                }

                // =====================================
                // 500+ - SERVER ERROR
                // =====================================

                if (status >= 500) {
                    console.error(
                        "Laravel Server Error:",
                        data?.message ||
                            "Internal server error."
                    );
                }

                return Promise.reject(error);
            }

            // -----------------------------------------
            // REQUEST WAS SENT BUT NO RESPONSE
            // -----------------------------------------

            if (error.request) {
                console.error(
                    "No response from Laravel:",
                    error.message
                );

                return Promise.reject(error);
            }

            // -----------------------------------------
            // AXIOS CONFIGURATION ERROR
            // -----------------------------------------

            console.error(
                "Axios Error:",
                error.message
            );

            return Promise.reject(error);
        }
    );
};

// =====================================================
// EXPORT
// =====================================================

export default setupInterceptors;
