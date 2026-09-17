// src/services/sellerInventoryService.js

import api from "../../api/axios";

/**
 * ==========================================
 * Seller Inventory Service
 * ==========================================
 */
const sellerInventoryService = {
  /**
   * ------------------------------------------
   * Get All Inventory Records
   * GET /seller/inventories
   * ------------------------------------------
   */
  async getInventories() {
    const response = await api.get("/seller/inventories");
    return response.data;
  },

  /**
   * ------------------------------------------
   * Get Single Inventory Record
   * GET /seller/inventories/:id
   * ------------------------------------------
   */
  async getInventory(id) {
    const response = await api.get(`/seller/inventories/${id}`);
    return response.data;
  },

  /**
   * ------------------------------------------
   * Create Inventory Record
   * POST /seller/inventories
   * ------------------------------------------
   *
   * data = {
   *   product_id,
   *   product_variant_id,
   *   quantity,
   *   type,
   *   note
   * }
   */
  async createInventory(data) {
    const response = await api.post("/seller/inventories", data);
    return response.data;
  },

  /**
   * ------------------------------------------
   * Update Inventory
   * PUT /seller/inventories/:id
   * ------------------------------------------
   *
   * data = {
   *   note
   * }
   */
  async updateInventory(id, data) {
    const response = await api.put(`/seller/inventories/${id}`, data);
    return response.data;
  },

  /**
   * ------------------------------------------
   * Delete Inventory Record
   * DELETE /seller/inventories/:id
   * ------------------------------------------
   */
  async deleteInventory(id) {
    const response = await api.delete(`/seller/inventories/${id}`);
    return response.data;
  },
};

export default sellerInventoryService;