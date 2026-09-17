import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const PROFILE_URL = "/admin/profile";
const CHANGE_PASSWORD_URL = "/admin/change-password";

const profileService = {
    // ===============================
    // Get Admin Profile
    // GET /api/admin/profile
    // ===============================
    getProfile: async () => {
        const response = await axiosInstance.get(
            PROFILE_URL
        );

        return response.data;
    },

    // ===============================
    // Update Admin Profile
    // PUT /api/admin/profile
    // ===============================
    updateProfile: async (profileData) => {
        const response = await axiosInstance.put(
            PROFILE_URL,
            profileData
        );

        return response.data;
    },

    // ===============================
    // Change Password
    // POST /api/admin/change-password
    // ===============================
    changePassword: async (passwordData) => {
        const response = await axiosInstance.post(
            CHANGE_PASSWORD_URL,
            passwordData
        );

        return response.data;
    },
};

export default profileService;