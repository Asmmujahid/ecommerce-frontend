// ============================================================
// FILE:
// src/pages/Admin/Payments/EditPayment.jsx
// ============================================================

import React, { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import PaymentForm from "../../../components/admin/payment/PaymentForm";

import {
    getPayment,
    updatePayment,
    clearPaymentError,
    clearPaymentMessage,
    clearCurrentPayment,
} from "../../../redux/admin/paymentSlice";

const EditPayment = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        payment = null,
        paymentLoading = false,
        loading = false,
        error = null,
        successMessage = null,
    } = useSelector(
        (state) =>
            state.adminPayment || {}
    );

    // ============================================================
    // LOAD PAYMENT
    // ============================================================
    useEffect(() => {
        if (!id) {
            return;
        }

        // Clear old payment before loading the new one.
        dispatch(clearCurrentPayment());
        dispatch(clearPaymentError());
        dispatch(clearPaymentMessage());

        dispatch(
            getPayment(id)
        );

        return () => {
            dispatch(
                clearCurrentPayment()
            );

            dispatch(
                clearPaymentError()
            );

            dispatch(
                clearPaymentMessage()
            );
        };
    }, [dispatch, id]);

    // ============================================================
    // AFTER SUCCESSFUL UPDATE
    // ============================================================
    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timer = setTimeout(() => {
            dispatch(
                clearPaymentMessage()
            );

            navigate(
                "/admin/payments"
            );
        }, 1500);

        return () => {
            clearTimeout(timer);
        };
    }, [
        successMessage,
        dispatch,
        navigate,
    ]);

    // ============================================================
    // SUBMIT PAYMENT UPDATE
    // ============================================================
    const handleSubmit = async (
        formData
    ) => {
        if (!id) {
            return;
        }

        /*
         * PaymentForm already prepares:
         *
         * {
         *     status: "paid",
         *     transaction_id: "TXN-10001",
         *     payment_method: "card"
         * }
         *
         * We pass that object directly to Redux.
         */
        try {
            const result =
                await dispatch(
                    updatePayment({
                        id,
                        paymentData: formData,
                    })
                ).unwrap();

            /*
             * Useful during development.
             *
             * After saving, the backend response should contain:
             *
             * transaction_id: "TXN-10001"
             */
            console.log(
                "Payment updated successfully:",
                result
            );
        } catch (updateError) {
            console.error(
                "Payment update failed:",
                updateError
            );
        }
    };

    // ============================================================
    // BACK
    // ============================================================
    const handleBack = () => {
        navigate(
            "/admin/payments"
        );
    };

    // ============================================================
    // LOADING PAYMENT
    // ============================================================
    if (
        paymentLoading &&
        !payment
    ) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    // ============================================================
    // INVALID ID
    // ============================================================
    if (!id) {
        return (
            <Container maxWidth="md">
                <Alert
                    severity="error"
                    sx={{ mt: 4 }}
                >
                    Payment ID is missing.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Back to Payments
                </Button>
            </Container>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================
    return (
        <Container maxWidth="md">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}
            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Edit Payment
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                    >
                        Update payment status,
                        transaction ID and payment
                        information.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={handleBack}
                    disabled={loading}
                >
                    Back
                </Button>
            </Stack>

            {/* ==================================================
                ERROR
            ================================================== */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {typeof error === "string"
                        ? error
                        : error?.message ||
                          "Failed to load or update payment."}
                </Alert>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}
            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
                </Alert>
            )}

            {/* ==================================================
                PAYMENT NOT FOUND
            ================================================== */}
            {!paymentLoading &&
                !payment &&
                !error && (
                    <Alert severity="warning">
                        Payment not found.
                    </Alert>
                )}

            {/* ==================================================
                PAYMENT FORM
            ================================================== */}
            {payment && (
                <Card>
                    <CardContent>

                        <PaymentForm
                            initialValues={
                                payment
                            }
                            loading={loading}
                            submitLabel="Update Payment"
                            onSubmit={
                                handleSubmit
                            }
                        />

                    </CardContent>
                </Card>
            )}

        </Container>
    );
};

export default EditPayment;

