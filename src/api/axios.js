
// src/api/axios.js

import axios from "axios";
import setupInterceptors from "./interceptors";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

    timeout: 30000,

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// =====================================================
// SETUP INTERCEPTORS
// =====================================================

setupInterceptors(api);

// =====================================================
// EXPORT
// =====================================================

export default api;

