import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";


const BASE_URL = "/admin/inventories";


const inventoryService = {

    /**
     * Get all inventories
     */
    getInventories: async () => {
        const response = await axiosInstance.get(BASE_URL);

        return response.data;
    },


    /**
     * Get single inventory
     */
    getInventory: async (id) => {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);

        return response.data;
    },


    /**
     * Create inventory stock IN / OUT
     *
     * data:
     * {
     *   product_id,
     *   product_variant_id,
     *   quantity,
     *   type,
     *   note
     * }
     */
    createInventory: async (data) => {

        const response = await axiosInstance.post(
            BASE_URL,
            data
        );

        return response.data;
    },


    /**
     * Update inventory record
     *
     * data:
     * {
     *   quantity,
     *   type,
     *   note
     * }
     */
    updateInventory: async (id, data) => {

        const response = await axiosInstance.put(
            `${BASE_URL}/${id}`,
            data
        );

        return response.data;
    },


    /**
     * Delete inventory
     */
    deleteInventory: async (id) => {

        const response = await axiosInstance.delete(
            `${BASE_URL}/${id}`
        );

        return response.data;
    }

};


export default inventoryService;