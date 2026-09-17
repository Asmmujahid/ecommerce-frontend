
// src/services/customer/reviewService.js

import axios from "../../api/axios";

// =====================================================
// CUSTOMER REVIEW SERVICE
// =====================================================

const reviewService = {
    // =================================================
    // GET ALL CUSTOMER REVIEWS
    // GET /customer/reviews
    // =================================================

    getReviews: async () => {
        const response = await axios.get(
            "/customer/reviews"
        );

        return response.data;
    },

    // =================================================
    // GET REVIEWABLE PRODUCTS
    // GET /customer/reviews/reviewable-products
    // =================================================

    getReviewableProducts: async () => {
        const response = await axios.get(
            "/customer/reviews/reviewable-products"
        );

        return response.data;
    },

    // =================================================
    // GET SINGLE REVIEW
    // GET /customer/reviews/{id}
    // =================================================

    getReview: async (id) => {
        if (!id) {
            throw new Error(
                "Review ID is required."
            );
        }

        const response = await axios.get(
            `/customer/reviews/${id}`
        );

        return response.data;
    },

    // =================================================
    // CREATE REVIEW
    // POST /customer/reviews
    // =================================================

    createReview: async (reviewData) => {
        if (!reviewData?.product_id) {
            throw new Error(
                "Product ID is required."
            );
        }

        if (!reviewData?.rating) {
            throw new Error(
                "Rating is required."
            );
        }

        const response = await axios.post(
            "/customer/reviews",
            {
                product_id:
                    Number(
                        reviewData.product_id
                    ),

                rating:
                    Number(
                        reviewData.rating
                    ),

                comment:
                    reviewData.comment?.trim() ||
                    null,
            }
        );

        return response.data;
    },

    // =================================================
    // UPDATE REVIEW
    // PUT /customer/reviews/{id}
    // =================================================

    updateReview: async (
        id,
        reviewData
    ) => {
        if (!id) {
            throw new Error(
                "Review ID is required."
            );
        }

        if (!reviewData?.rating) {
            throw new Error(
                "Rating is required."
            );
        }

        const response = await axios.put(
            `/customer/reviews/${id}`,
            {
                rating:
                    Number(
                        reviewData.rating
                    ),

                comment:
                    reviewData.comment?.trim() ||
                    null,
            }
        );

        return response.data;
    },

    // =================================================
    // DELETE REVIEW
    // DELETE /customer/reviews/{id}
    // =================================================

    deleteReview: async (id) => {
        if (!id) {
            throw new Error(
                "Review ID is required."
            );
        }

        const response = await axios.delete(
            `/customer/reviews/${id}`
        );

        return response.data;
    },
};

// =====================================================
// EXPORT
// =====================================================

export default reviewService;

