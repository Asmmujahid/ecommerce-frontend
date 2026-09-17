import api from "../../api/axios";

const BASE_URL = "/seller/products";

const sellerProductService = {
    // =========================================================
    // PRODUCTS
    // =========================================================

    getSellerProducts: async (filters = {}) => {
        const cleanedFilters =
            Object.fromEntries(
                Object.entries(filters).filter(
                    ([, value]) =>
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                )
            );

        const response = await api.get(
            BASE_URL,
            {
                params: cleanedFilters,
            }
        );

        return response.data;
    },

    // =========================================================
    // GET SINGLE PRODUCT
    // =========================================================

    getSellerProduct: async (productId) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        const id = Number(productId);

        console.log(
            "sellerProductService.getSellerProduct ID:",
            id
        );

        const response = await api.get(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },

    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    createSellerProduct: async (
        productData
    ) => {
        const response = await api.post(
            BASE_URL,
            productData
        );

        return response.data;
    },

    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    updateSellerProduct: async (
        productId,
        productData
    ) => {
        // -----------------------------------------------------
        // IMPORTANT VALIDATION
        // -----------------------------------------------------

        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required to update the product."
            );
        }

        const id = Number(productId);

        console.log(
            "sellerProductService.updateSellerProduct ID:",
            id
        );

        console.log(
            "sellerProductService.updateSellerProduct data:",
            productData
        );

        // -----------------------------------------------------
        // API REQUEST
        // -----------------------------------------------------

        const response = await api.put(
            `${BASE_URL}/${id}`,
            productData
        );

        return response.data;
    },

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    deleteSellerProduct: async (
        productId
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required to delete the product."
            );
        }

        const id = Number(productId);

        const response = await api.delete(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },

    // =========================================================
    // PRODUCT IMAGES
    // =========================================================

    getProductImages: async (
        productId
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        const response = await api.get(
            `${BASE_URL}/${Number(productId)}/images`
        );

        return response.data;
    },

    addProductImage: async (
        productId,
        imageData
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        const response = await api.post(
            `${BASE_URL}/${Number(productId)}/images`,
            imageData
        );

        return response.data;
    },

    uploadProductImage: async (
        productId,
        imageData
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        const response = await api.post(
            `${BASE_URL}/${Number(productId)}/images`,
            imageData
        );

        return response.data;
    },

    updateProductImage: async (
        imageId,
        imageData
    ) => {
        if (
            !imageId ||
            Number.isNaN(Number(imageId))
        ) {
            throw new Error(
                "Valid image ID is required."
            );
        }

        const response = await api.put(
            `/seller/product-images/${Number(
                imageId
            )}`,
            imageData
        );

        return response.data;
    },

    deleteProductImage: async (
        productId,
        imageId
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        if (
            !imageId ||
            Number.isNaN(Number(imageId))
        ) {
            throw new Error(
                "Valid image ID is required."
            );
        }

        const response = await api.delete(
            `${BASE_URL}/${Number(
                productId
            )}/images/${Number(imageId)}`
        );

        return response.data;
    },

    // =========================================================
    // PRODUCT VARIANTS
    // =========================================================

    getProductVariants: async (
        productId
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        const response = await api.get(
            `${BASE_URL}/${Number(
                productId
            )}/variants`
        );

        return response.data;
    },

    createProductVariant: async (
        productId,
        variantData
    ) => {
        if (
            !productId ||
            Number.isNaN(Number(productId))
        ) {
            throw new Error(
                "Valid product ID is required."
            );
        }

        const response = await api.post(
            `${BASE_URL}/${Number(
                productId
            )}/variants`,
            variantData
        );

        return response.data;
    },

    getProductVariant: async (
        variantId
    ) => {
        if (
            !variantId ||
            Number.isNaN(Number(variantId))
        ) {
            throw new Error(
                "Valid variant ID is required."
            );
        }

        const response = await api.get(
            `/seller/product-variants/${Number(
                variantId
            )}`
        );

        return response.data;
    },

    updateProductVariant: async (
        variantId,
        variantData
    ) => {
        if (
            !variantId ||
            Number.isNaN(Number(variantId))
        ) {
            throw new Error(
                "Valid variant ID is required."
            );
        }

        const response = await api.put(
            `/seller/product-variants/${Number(
                variantId
            )}`,
            variantData
        );

        return response.data;
    },

    deleteProductVariant: async (
        variantId
    ) => {
        if (
            !variantId ||
            Number.isNaN(Number(variantId))
        ) {
            throw new Error(
                "Valid variant ID is required."
            );
        }

        const response = await api.delete(
            `/seller/product-variants/${Number(
                variantId
            )}`
        );

        return response.data;
    },
};

export default sellerProductService;