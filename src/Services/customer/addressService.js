// src/Services/customer/addressService.js

import api from "../../api/axios";

// =====================================================
// CUSTOMER ADDRESS SERVICE
// =====================================================

const addressService = {
    // =================================================
    // GET ALL ADDRESSES
    // GET /api/customer/addresses
    // =================================================

    getAddresses: async () => {
        try {
            const response = await api.get(
                "/customer/addresses"
            );

            console.log(
                "GET ADDRESSES RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "GET ADDRESSES ERROR:",
                error?.response?.data || error
            );

            throw error;
        }
    },

    // =================================================
    // GET SINGLE ADDRESS
    // GET /api/customer/addresses/{id}
    // =================================================

    getAddress: async (id) => {
        try {
            if (!id) {
                throw new Error(
                    "Address ID is required."
                );
            }

            const response = await api.get(
                `/customer/addresses/${id}`
            );

            console.log(
                "GET ADDRESS RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "GET ADDRESS ERROR:",
                error?.response?.data || error
            );

            throw error;
        }
    },

    // =================================================
    // CREATE ADDRESS
    // POST /api/customer/addresses
    // =================================================

    createAddress: async (addressData) => {
        try {
            if (
                !addressData ||
                typeof addressData !== "object"
            ) {
                throw new Error(
                    "Address data is required."
                );
            }

            console.log(
                "CREATE ADDRESS REQUEST:",
                addressData
            );

            const response = await api.post(
                "/customer/addresses",
                addressData
            );

            console.log(
                "CREATE ADDRESS RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "CREATE ADDRESS ERROR:",
                error?.response?.data || error
            );

            throw error;
        }
    },

    // =================================================
    // UPDATE ADDRESS
    // PUT /api/customer/addresses/{id}
    // =================================================

    updateAddress: async (id, addressData) => {
        try {
            if (!id) {
                throw new Error(
                    "Address ID is required."
                );
            }

            if (
                !addressData ||
                typeof addressData !== "object"
            ) {
                throw new Error(
                    "Address data is required."
                );
            }

            console.log(
                "UPDATE ADDRESS REQUEST:",
                {
                    id,
                    addressData,
                }
            );

            const response = await api.put(
                `/customer/addresses/${id}`,
                addressData
            );

            console.log(
                "UPDATE ADDRESS RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "UPDATE ADDRESS ERROR:",
                error?.response?.data || error
            );

            throw error;
        }
    },

    // =================================================
    // DELETE ADDRESS
    // DELETE /api/customer/addresses/{id}
    // =================================================

    deleteAddress: async (id) => {
        try {
            if (!id) {
                throw new Error(
                    "Address ID is required."
                );
            }

            console.log(
                "DELETE ADDRESS REQUEST:",
                id
            );

            const response = await api.delete(
                `/customer/addresses/${id}`
            );

            console.log(
                "DELETE ADDRESS RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "DELETE ADDRESS ERROR:",
                error?.response?.data || error
            );

            throw error;
        }
    },
};

// =====================================================
// EXPORT
// =====================================================

export default addressService;