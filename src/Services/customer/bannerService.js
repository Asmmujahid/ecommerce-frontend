
// src/Services/customer/bannerService.js

import axiosInstance from "../../api/axios";

// =====================================================
// BASE URL
// =====================================================

const BASE_URL = "/banners";

// =====================================================
// GET ACTIVE BANNERS
//
// GET /api/banners
// =====================================================

export const getBanners = async () => {
    const response = await axiosInstance.get(
        BASE_URL
    );

    return response.data;
};

// =====================================================
// DEFAULT SERVICE OBJECT
// =====================================================

const bannerService = {
    getBanners,
};

export default bannerService;

