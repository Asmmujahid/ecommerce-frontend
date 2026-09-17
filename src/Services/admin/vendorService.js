import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const BASE_URL = "/admin/vendors";

// ===============================
// Get All Vendors
// ===============================
const getVendors = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

// ===============================
// Get Single Vendor
// ===============================
const getVendor = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

// ===============================
// Update Vendor
// ===============================
const updateVendor = async ({ id, vendorData }) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        vendorData
    );

    return response.data;
};

// ===============================
// Delete Vendor
// ===============================
const deleteVendor = async (id) => {
    const response = await axiosInstance.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

const vendorService = {
    getVendors,
    getVendor,
    updateVendor,
    deleteVendor,
};

export default vendorService;