import axiosInstance from "../../api/axios";

const BASE_URL = "/admin/payments";

/*
|--------------------------------------------------------------------------
| Remove empty query parameters
|--------------------------------------------------------------------------
*/
const cleanParams = (params = {}) => {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
        )
    );
};

/*
|--------------------------------------------------------------------------
| Normalize Payment Payload
|--------------------------------------------------------------------------
|
| Make sure transaction_id is always sent using the exact
| Laravel database field name.
|
*/
const normalizePaymentData = (paymentData = {}) => {
    const transactionId =
        paymentData.transaction_id ??
        paymentData.transactionId ??
        "";

    const paymentMethod =
        paymentData.payment_method ??
        paymentData.paymentMethod ??
        "";

    return {
        status: paymentData.status || "pending",

        transaction_id:
            String(transactionId).trim() || null,

        ...(String(paymentMethod).trim()
            ? {
                  payment_method:
                      String(paymentMethod).trim(),
              }
            : {}),
    };
};

/*
|--------------------------------------------------------------------------
| Payment Service
|--------------------------------------------------------------------------
*/
const paymentService = {
    /*
    |--------------------------------------------------------------------------
    | Get Payments
    |--------------------------------------------------------------------------
    | GET /api/admin/payments
    |--------------------------------------------------------------------------
    */
    getPayments: async (params = {}) => {
        const response = await axiosInstance.get(
            BASE_URL,
            {
                params: cleanParams(params),
            }
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Get Single Payment
    |--------------------------------------------------------------------------
    | GET /api/admin/payments/{id}
    |--------------------------------------------------------------------------
    */
    getPayment: async (id) => {
        if (!id) {
            throw new Error(
                "Payment ID is required."
            );
        }

        const response =
            await axiosInstance.get(
                `${BASE_URL}/${id}`
            );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Update Payment
    |--------------------------------------------------------------------------
    | PUT /api/admin/payments/{id}
    |--------------------------------------------------------------------------
    */
    updatePayment: async (
        id,
        paymentData
    ) => {
        if (!id) {
            throw new Error(
                "Payment ID is required."
            );
        }

        if (
            !paymentData ||
            typeof paymentData !== "object"
        ) {
            throw new Error(
                "Payment data is required."
            );
        }

        /*
        |----------------------------------------------------------------------
        | Normalize before sending to Laravel
        |----------------------------------------------------------------------
        */
        const payload =
            normalizePaymentData(
                paymentData
            );

        console.log(
            "Updating payment:",
            id
        );

        console.log(
            "Payment payload:",
            payload
        );

        const response =
            await axiosInstance.put(
                `${BASE_URL}/${id}`,
                payload
            );

        console.log(
            "Payment update response:",
            response.data
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Delete Payment
    |--------------------------------------------------------------------------
    | DELETE /api/admin/payments/{id}
    |--------------------------------------------------------------------------
    */
    deletePayment: async (id) => {
        if (!id) {
            throw new Error(
                "Payment ID is required."
            );
        }

        const response =
            await axiosInstance.delete(
                `${BASE_URL}/${id}`
            );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Get Admin Earnings
    |--------------------------------------------------------------------------
    | GET /api/admin/payments/earnings
    |--------------------------------------------------------------------------
    */
    getEarnings: async () => {
        const response =
            await axiosInstance.get(
                `${BASE_URL}/earnings`
            );

        return response.data;
    },
};

export default paymentService;

