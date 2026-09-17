// src/pages/Customer/Payments/PaymentDetailsPage.jsx

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useLocation,
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
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    CreditCard,
    DeleteOutline,
    ReceiptLong,
} from "@mui/icons-material";

// =====================================================
// REDUX
// =====================================================

import {
    fetchPaymentById,
    clearPaymentError,
    clearPayment,
    deletePayment,
    selectSelectedPayment,
    selectPaymentDetailsLoading,
    selectPaymentDetailsError,
    selectDeletingPaymentId,
    selectDeletePaymentError,
} from "../../../redux/customer/paymentSlice";

// =====================================================
// COMPONENTS
// =====================================================

import PaymentStatus from "../../../components/customer/payment/PaymentStatus";

// =====================================================
// FORMAT PRICE
// =====================================================

const formatPrice = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return "0.00";
    }

    return value.toLocaleString(
        "en-PK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleString(
        "en-PK",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
};

// =====================================================
// FORMAT PAYMENT METHOD
// =====================================================

const formatPaymentMethod = (
    method
) => {
    if (!method) {
        return "N/A";
    }

    return String(method)
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );
};

// =====================================================
// SAFE NUMBER
// =====================================================

const safeNumber = (
    value,
    fallback = 0
) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};

// =====================================================
// COMPONENT
// =====================================================

const PaymentDetailsPage = () => {
    const { id } = useParams();

    const location = useLocation();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // =================================================
    // LOCAL STATE
    // =================================================

    const [
        deleteErrorVisible,
        setDeleteErrorVisible,
    ] = useState(false);

    // =================================================
    // REDUX
    // =================================================

    const reduxPayment = useSelector(
        selectSelectedPayment
    );

    const loading = useSelector(
        selectPaymentDetailsLoading
    );

    const error = useSelector(
        selectPaymentDetailsError
    );

    const deletingPaymentId =
        useSelector(
            selectDeletingPaymentId
        );

    const deleteError = useSelector(
        selectDeletePaymentError
    );

    // =================================================
    // PAYMENT PASSED FROM CHECKOUT
    // =================================================

    const statePayment =
        location.state?.payment ||
        null;

    const stateOrder =
        location.state?.order ||
        null;

    // =================================================
    // PAYMENT
    // =================================================

    /*
     * Prefer the payment returned by the details API.
     *
     * If the details API has not loaded yet, use the
     * payment passed from checkout navigation.
     */

    const payment =
        reduxPayment?.id
            ? reduxPayment
            : statePayment;

    // =================================================
    // ORDER
    // =================================================

    const order =
        payment?.order ||
        stateOrder ||
        null;

    // =================================================
    // DELETE LOADING
    // =================================================

    const isDeleting =
        Number(
            deletingPaymentId
        ) === Number(id);

    // =================================================
    // FETCH PAYMENT
    // =================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        console.log(
            "PAYMENT DETAILS PAGE ID:",
            id
        );

        dispatch(
            fetchPaymentById(id)
        );

        return () => {
            dispatch(
                clearPaymentError()
            );

            dispatch(
                clearPayment()
            );
        };
    }, [
        dispatch,
        id,
    ]);

    // =================================================
    // ORDER NUMBER
    // =================================================

    const orderNumber = useMemo(() => {
        return (
            order?.order_number ||
            order?.orderNumber ||
            order?.id ||
            payment?.order_id ||
            "N/A"
        );
    }, [
        order,
        payment,
    ]);

    // =================================================
    // SUBTOTAL
    // =================================================

    const subtotalAmount = useMemo(() => {
        const value =
            order?.subtotal_amount;

        if (
            value !== undefined &&
            value !== null &&
            Number.isFinite(
                Number(value)
            )
        ) {
            return Number(value);
        }

        return null;
    }, [order]);

    // =================================================
    // DISCOUNT
    // =================================================

    const discountAmount = useMemo(() => {
        const value =
            order?.discount_amount;

        if (
            value === undefined ||
            value === null
        ) {
            return 0;
        }

        const number =
            Number(value);

        return Number.isFinite(number) &&
            number > 0
            ? number
            : 0;
    }, [order]);

    // =================================================
    // COUPON CODE
    // =================================================

    const couponCode = useMemo(() => {
        return (
            order?.coupon_code ||
            order?.coupon?.code ||
            order?.coupon?.coupon_code ||
            null
        );
    }, [order]);

    // =================================================
    // FINAL ORDER TOTAL
    // =================================================

    const orderTotal = useMemo(() => {
        const value =
            order?.total_amount;

        if (
            value !== undefined &&
            value !== null &&
            Number.isFinite(
                Number(value)
            )
        ) {
            return Number(value);
        }

        return null;
    }, [order]);

    // =================================================
    // PAYMENT AMOUNT
    // =================================================

    /*
     * IMPORTANT:
     *
     * The final amount should represent the amount
     * actually saved for this order/payment.
     *
     * Priority:
     *
     * 1. order.total_amount
     * 2. payment.amount
     */

    const finalPaymentAmount =
        useMemo(() => {
            if (
                orderTotal !== null
            ) {
                return Math.max(
                    0,
                    orderTotal
                );
            }

            const paymentAmount =
                safeNumber(
                    payment?.amount,
                    0
                );

            return Math.max(
                0,
                paymentAmount
            );
        }, [
            orderTotal,
            payment,
        ]);

    // =================================================
    // DELETE PAYMENT
    // =================================================

    const handleDelete = async () => {
        if (!payment?.id) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this payment history?"
            );

        if (!confirmed) {
            return;
        }

        setDeleteErrorVisible(
            false
        );

        try {
            await dispatch(
                deletePayment(
                    payment.id
                )
            ).unwrap();

            navigate(
                "/customer/payments",
                {
                    replace: true,
                }
            );

        } catch (deleteError) {
            console.error(
                "DELETE PAYMENT ERROR:",
                deleteError
            );

            setDeleteErrorVisible(
                true
            );
        }
    };

    // =================================================
    // LOADING
    // =================================================

    if (
        loading &&
        !statePayment &&
        !reduxPayment
    ) {
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
                        Loading payment details...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (
        error &&
        !statePayment &&
        !reduxPayment
    ) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    backgroundColor: "grey.50",
                    py: 6,
                }}
            >
                <Container maxWidth="md">
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>

                    <Button
                        variant="contained"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/customer/payments"
                            )
                        }
                        sx={{
                            textTransform:
                                "none",
                        }}
                    >
                        Back to Payments
                    </Button>
                </Container>
            </Box>
        );
    }

    // =================================================
    // PAYMENT NOT FOUND
    // =================================================

    if (!payment) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    backgroundColor: "grey.50",
                    py: 6,
                }}
            >
                <Container maxWidth="md">
                    <Card
                        sx={{
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{
                                textAlign:
                                    "center",
                                py: 6,
                            }}
                        >
                            <ReceiptLong
                                sx={{
                                    fontSize: 65,
                                    color:
                                        "text.secondary",
                                    mb: 2,
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Payment Not Found
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    mb: 3,
                                }}
                            >
                                The requested
                                payment could
                                not be found.
                            </Typography>

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                                justifyContent="center"
                            >
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/customer/payments"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                    }}
                                >
                                    Back to Payments
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            "/customer/orders"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                    }}
                                >
                                    View Orders
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
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
                    md: 6,
                },
            }}
        >
            <Container maxWidth="md">

                {/* =====================================
                    BACK
                ====================================== */}

                <Button
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/customer/payments"
                        )
                    }
                    sx={{
                        mb: 3,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Back to Payments
                </Button>

                {/* =====================================
                    MAIN CARD
                ====================================== */}

                <Card
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
                        }}
                    >
                        <Stack spacing={3}>

                            {/* =================================
                                HEADER
                            ================================== */}

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
                                gap={2}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Box
                                        sx={{
                                            width: 55,
                                            height: 55,
                                            borderRadius: 2,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            backgroundColor:
                                                "primary.50",
                                            color:
                                                "primary.main",
                                        }}
                                    >
                                        <CreditCard fontSize="large" />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                        >
                                            Payment Details
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Payment #
                                            {payment.id}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* STATUS + DELETE */}

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <PaymentStatus
                                        status={
                                            payment.status
                                        }
                                    />

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={
                                            <DeleteOutline />
                                        }
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={
                                            isDeleting
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {isDeleting
                                            ? "Deleting..."
                                            : "Delete"}
                                    </Button>
                                </Stack>
                            </Stack>

                            {/* =================================
                                DELETE ERROR
                            ================================== */}

                            {deleteErrorVisible &&
                                deleteError && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            borderRadius:
                                                2,
                                        }}
                                    >
                                        {
                                            deleteError
                                        }
                                    </Alert>
                                )}

                            <Divider />

                            {/* =================================
                                FINAL PAYMENT AMOUNT
                            ================================== */}

                            <Box
                                sx={{
                                    textAlign:
                                        "center",
                                    py: 2,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Payment Amount
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight={800}
                                    color="primary"
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    Rs.{" "}
                                    {formatPrice(
                                        finalPaymentAmount
                                    )}
                                </Typography>
                            </Box>

                            {/* =================================
                                PRICE BREAKDOWN
                            ================================== */}

                            {(
                                subtotalAmount !==
                                    null ||
                                discountAmount > 0
                            ) && (
                                <>
                                    <Divider />

                                    <Stack
                                        spacing={2}
                                    >
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                        >
                                            Order Summary
                                        </Typography>

                                        {/* SUBTOTAL */}

                                        {subtotalAmount !==
                                            null && (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                gap={2}
                                            >
                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    Subtotal
                                                </Typography>

                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    Rs.{" "}
                                                    {formatPrice(
                                                        subtotalAmount
                                                    )}
                                                </Typography>
                                            </Stack>
                                        )}

                                        {/* DISCOUNT */}

                                        {discountAmount >
                                            0 && (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                gap={2}
                                            >
                                                <Box>
                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        Coupon Discount
                                                    </Typography>

                                                    {couponCode && (
                                                        <Typography
                                                            variant="caption"
                                                            color="success.main"
                                                        >
                                                            Coupon:{" "}
                                                            {
                                                                couponCode
                                                            }
                                                        </Typography>
                                                    )}
                                                </Box>

                                                <Typography
                                                    fontWeight={600}
                                                    color="success.main"
                                                >
                                                    - Rs.{" "}
                                                    {formatPrice(
                                                        discountAmount
                                                    )}
                                                </Typography>
                                            </Stack>
                                        )}

                                        {/* TOTAL */}

                                        <Divider />

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            gap={2}
                                        >
                                            <Typography
                                                fontWeight={700}
                                            >
                                                Total
                                            </Typography>

                                            <Typography
                                                fontWeight={800}
                                                color="primary"
                                            >
                                                Rs.{" "}
                                                {formatPrice(
                                                    finalPaymentAmount
                                                )}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </>
                            )}

                            <Divider />

                            {/* =================================
                                INFORMATION
                            ================================== */}

                            <Stack spacing={2}>

                                {/* ORDER */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Order Number
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                    >
                                        #{orderNumber}
                                    </Typography>
                                </Stack>

                                {/* METHOD */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Payment Method
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {formatPaymentMethod(
                                            payment.payment_method ||
                                            payment.method
                                        )}
                                    </Typography>
                                </Stack>

                                {/* TRANSACTION */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Transaction ID
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                        sx={{
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {payment.transaction_id ||
                                            payment.transactionId ||
                                            "Not generated"}
                                    </Typography>
                                </Stack>

                                {/* STATUS */}

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
                                    gap={1}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Payment Status
                                    </Typography>

                                    <PaymentStatus
                                        status={
                                            payment.status
                                        }
                                    />
                                </Stack>

                                {/* CREATED */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Created At
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {formatDate(
                                            payment.created_at
                                        )}
                                    </Typography>
                                </Stack>

                                {/* PAID */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Paid At
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {formatDate(
                                            payment.paid_at
                                        )}
                                    </Typography>
                                </Stack>

                            </Stack>

                            <Divider />

                            {/* =================================
                                VIEW ORDER
                            ================================== */}

                            {(
                                payment.order_id ||
                                order?.id
                            ) && (
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            `/customer/orders/${
                                                payment.order_id ||
                                                order?.id
                                            }`
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 600,
                                    }}
                                >
                                    View Order
                                </Button>
                            )}

                            {/* =================================
                                FOOTER
                            ================================== */}

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Payment information
                                is securely stored
                                with your order.
                            </Typography>

                        </Stack>
                    </CardContent>
                </Card>

            </Container>
        </Box>
    );
};

export default PaymentDetailsPage;

