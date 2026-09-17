// src/services/sellerCustomerService.js
import api from "../../api/axios";

/**
 * ==========================================
 * Seller Customer Service
 * ==========================================
 */
const sellerCustomerService = {
  /**
   * ------------------------------------------
   * Get All Customers
   * GET /seller/customers
   * ------------------------------------------
   */
  async getCustomers() {
    const response = await api.get("/seller/customers");
    return response.data;
  },

  /**
   * ------------------------------------------
   * Get Single Customer
   * GET /seller/customers/:id
   * ------------------------------------------
   */
  async getCustomer(id) {
    const response = await api.get(`/seller/customers/${id}`);
    return response.data;
  },
};

export default sellerCustomerService;