import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const BASE_URL = "/admin/users";

// ==========================================
// Get All Users
// ==========================================

const getUsers = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

// ==========================================
// Get Single User
// ==========================================

const getUser = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

// ==========================================
// Update User
// ==========================================

const updateUser = async (id, userData) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        userData
    );

    return response.data;
};

// ==========================================
// Delete User
// ==========================================

const deleteUser = async (id) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
};

const userService = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};

export default userService;