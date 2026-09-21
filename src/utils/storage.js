// =====================================================
// Storage URL
// =====================================================

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

export const STORAGE_URL = `${API_ORIGIN}/storage`;