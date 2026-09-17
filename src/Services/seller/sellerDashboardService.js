// src/services/sellerDashboardService.js

import api from "../../api/axios";
import API from "../../api/endpoints";

/*
|--------------------------------------------------------------------------
| Seller Dashboard
|--------------------------------------------------------------------------
| GET /seller/dashboard
*/

const getDashboard = async () => {
    const response = await api.get(API.SELLER_DASHBOARD);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Export Service
|--------------------------------------------------------------------------
*/

const sellerDashboardService = {
    getDashboard,
};

export default sellerDashboardService;