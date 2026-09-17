// src/pages/Customer/Payments/PaymentsPage.jsx

import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    CreditCard,
    Refresh,
} from "@mui/icons-material";

import {
    fetchPayments,
    clearPaymentError,
    selectPayments,
    selectPaymentsLoading,
    selectPaymentsError,
} from "../../../redux/customer/paymentSlice";

import PaymentCard from "../../../components/customer/payment/PaymentCard";

// =====================================================
// COMPONENT
// =====================================================

const PaymentsPage = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // =================================================
    // REDUX
    // =================================================

    const payments = useSelector(
        selectPayments
    );

    const loading = useSelector(
        selectPaymentsLoading
    );

    const error = useSelector(
        selectPaymentsError
    );

    // =================================================
    // FETCH PAYMENTS
    // =================================================

    useEffect(() => {
        dispatch(fetchPayments());

        return () => {
            dispatch(clearPaymentError());
        };
    }, [dispatch]);

    // =================================================
    // RETRY / REFRESH
    // =================================================

    const handleRetry = () => {
        dispatch(fetchPayments());
    };

    // =================================================
    // SAFE PAYMENT LIST
    // =================================================

    const paymentList = Array.isArray(payments)
        ? payments
        : [];

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    backgroundColor: "grey.50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading payment history...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "70vh",
                backgroundColor: "grey.50",
                py: {
                    xs: 3,
                    sm: 4,
                    md: 6,
                },
            }}
        >
            <Container maxWidth="lg">

                {/* =====================================
                    HEADER
                ====================================== */}

                <Box sx={{ mb: 4 }}>
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                    >
                        <Box>
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                            >
                                <CreditCard
                                    color="primary"
                                    sx={{
                                        fontSize: 34,
                                    }}
                                />

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    Payment History
                                </Typography>
                            </Stack>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                }}
                            >
                                View all your
                                order payments
                                and their
                                current status.
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={handleRetry}
                            disabled={loading}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Refresh
                        </Button>
                    </Stack>
                </Box>

                {/* =====================================
                    ERROR
                ====================================== */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleRetry}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* =====================================
                    EMPTY
                ====================================== */}

                {!error &&
                    paymentList.length === 0 && (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: {
                                    xs: 3,
                                    md: 5,
                                },
                                borderRadius: 3,
                                textAlign: "center",
                            }}
                        >
                            <CreditCard
                                sx={{
                                    fontSize: 65,
                                    color: "text.secondary",
                                    mb: 2,
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                No Payments Found
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    mb: 3,
                                }}
                            >
                                You haven't made
                                any payments yet.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate("/shop")
                                }
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Start Shopping
                            </Button>
                        </Paper>
                    )}

                {/* =====================================
                    PAYMENTS
                ====================================== */}

                {paymentList.length > 0 && (
                    <Grid
                        container
                        spacing={3}
                    >
                        {paymentList.map(
                            (payment) => {
                                if (!payment?.id) {
                                    return null;
                                }

                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        key={payment.id}
                                    >
                                        <Box
                                            onClick={() =>
                                                navigate(
                                                    `/customer/payments/${payment.id}`
                                                )
                                            }
                                            sx={{
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            <PaymentCard
                                                payment={
                                                    payment
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                )}

                {/* =====================================
                    BACK TO ORDERS
                ====================================== */}

                <Button
                    variant="text"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/customer/orders"
                        )
                    }
                    sx={{
                        mt: 4,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Back to Orders
                </Button>

            </Container>
        </Box>
    );
};

export default PaymentsPage;

