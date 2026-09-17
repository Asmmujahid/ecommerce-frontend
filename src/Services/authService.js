import api from "../api/axios";
import API from "../api/endpoints";

const authService = {
    register(userData) {
        return api.post(API.REGISTER, userData);
    },

    login(credentials) {
        return api.post(API.LOGIN, credentials);
    },

    logout() {
        return api.post(API.LOGOUT);
    },

    forgotPassword(data) {
        return api.post(API.FORGOT_PASSWORD, data);
    },

    resetPassword(data) {
        return api.post(API.RESET_PASSWORD, data);
    },
};

export default authService;

