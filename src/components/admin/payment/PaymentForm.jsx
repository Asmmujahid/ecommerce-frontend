// ============================================================
// FILE:
// src/components/admin/payment/PaymentForm.jsx
// ============================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";

const EMPTY_FORM = {
    status: "pending",
    transaction_id: "",
    payment_method: "",
};

const PaymentForm = ({
    initialValues = {},
    loading = false,
    submitLabel = "Update Payment",
    onSubmit,
}) => {
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [formError, setFormError] = useState("");

    // ------------------------------------------------------------
    // Load existing payment data
    // ------------------------------------------------------------
    useEffect(() => {
        /*
         * Supports both:
         *
         * initialValues = {
         *     status: "paid",
         *     transaction_id: "TXN-1001"
         * }
         *
         * and, if your API ever returns:
         *
         * initialValues = {
         *     payment: {
         *         status: "paid",
         *         transaction_id: "TXN-1001"
         *     }
         * }
         */

        const payment =
            initialValues?.payment &&
            typeof initialValues.payment === "object"
                ? initialValues.payment
                : initialValues;

        setFormData({
            status: String(
                payment?.status || "pending"
            ).trim(),

            transaction_id:
                payment?.transaction_id !== null &&
                payment?.transaction_id !== undefined
                    ? String(payment.transaction_id)
                    : "",

            payment_method:
                payment?.payment_method !== null &&
                payment?.payment_method !== undefined
                    ? String(payment.payment_method)
                    : "",
        });

        setFormError("");
    }, [initialValues]);

    // ------------------------------------------------------------
    // Handle input changes
    // ------------------------------------------------------------
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
    };

    // ------------------------------------------------------------
    // Submit
    // ------------------------------------------------------------
    const handleSubmit = (event) => {
        event.preventDefault();

        const status = String(
            formData.status || ""
        ).trim();

        const transactionId = String(
            formData.transaction_id || ""
        ).trim();

        const paymentMethod = String(
            formData.payment_method || ""
        ).trim();

        // --------------------------------------------------------
        // Validate status
        // --------------------------------------------------------
        if (!status) {
            setFormError(
                "Please select a payment status."
            );

            return;
        }

        // --------------------------------------------------------
        // Validate submit handler
        // --------------------------------------------------------
        if (typeof onSubmit !== "function") {
            setFormError(
                "Payment submit handler is missing."
            );

            return;
        }

        // --------------------------------------------------------
        // Build API payload
        // --------------------------------------------------------
        const payload = {
            status,

            /*
             * Empty transaction ID becomes null.
             *
             * Example:
             * "TXN-1001" -> "TXN-1001"
             * ""         -> null
             */
            transaction_id:
                transactionId || null,
        };

        /*
         * Only send payment_method when it exists.
         *
         * This prevents accidentally changing the existing
         * payment method if this form does not provide one.
         */
        if (paymentMethod) {
            payload.payment_method = paymentMethod;
        }

        console.log(
            "Payment update payload:",
            payload
        );

        onSubmit(payload);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
        >
            <Stack spacing={3}>

                {/* ------------------------------------------------
                    Form error
                ------------------------------------------------ */}
                {formError && (
                    <Alert severity="error">
                        {formError}
                    </Alert>
                )}

                {/* ------------------------------------------------
                    Payment Status
                ------------------------------------------------ */}
                <TextField
                    select
                    fullWidth
                    required
                    label="Payment Status"
                    name="status"
                    value={
                        formData.status ||
                        "pending"
                    }
                    onChange={handleChange}
                    disabled={loading}
                >
                    <MenuItem value="pending">
                        Pending
                    </MenuItem>

                    <MenuItem value="paid">
                        Paid
                    </MenuItem>

                    <MenuItem value="failed">
                        Failed
                    </MenuItem>

                    <MenuItem value="refunded">
                        Refunded
                    </MenuItem>
                </TextField>

                {/* ------------------------------------------------
                    Transaction ID
                ------------------------------------------------ */}
                <TextField
                    fullWidth
                    label="Transaction ID"
                    name="transaction_id"
                    value={
                        formData.transaction_id
                    }
                    onChange={handleChange}
                    placeholder="Enter transaction ID"
                    disabled={loading}
                    helperText="Enter the transaction/reference ID provided by the payment provider."
                />

                {/* ------------------------------------------------
                    Payment Method
                ------------------------------------------------ */}
                <TextField
                    select
                    fullWidth
                    label="Payment Method"
                    name="payment_method"
                    value={
                        formData.payment_method
                    }
                    onChange={handleChange}
                    disabled={loading}
                >
                    <MenuItem value="">
                        Keep Existing Method
                    </MenuItem>

                    <MenuItem value="cod">
                        Cash on Delivery
                    </MenuItem>

                    <MenuItem value="bank_transfer">
                        Bank Transfer
                    </MenuItem>

                    <MenuItem value="card">
                        Card
                    </MenuItem>

                    <MenuItem value="online">
                        Online
                    </MenuItem>

                    <MenuItem value="wallet">
                        Wallet
                    </MenuItem>
                </TextField>

                {/* ------------------------------------------------
                    Submit Button
                ------------------------------------------------ */}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        minHeight: 48,
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={24}
                            color="inherit"
                        />
                    ) : (
                        submitLabel
                    )}
                </Button>
            </Stack>
        </Box>
    );
};

export default PaymentForm;

