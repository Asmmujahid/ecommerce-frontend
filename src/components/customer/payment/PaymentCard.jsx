// src/components/customer/payments/PaymentCard.jsx

import {
    useState,
} from "react";

import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    CreditCard,
    DeleteOutline,
    ReceiptLong,
} from "@mui/icons-material";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    deletePayment,
    selectDeletePaymentError,
    selectDeletingPaymentId,
} from "../../../redux/customer/paymentSlice";

import PaymentStatus from "./PaymentStatus";

// =====================================================
// FORMAT PRICE
// =====================================================

const formatPrice = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return "0.00";
    }

    return value.toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
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
// GET VALID NUMBER
// =====================================================

const getNumber = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
};

// =====================================================
// PAYMENT CARD
// =====================================================

const PaymentCard = ({
    payment,
}) => {
    const dispatch = useDispatch();

    // =================================================
    // REDUX
    // =================================================

    const deletingPaymentId =
        useSelector(
            selectDeletingPaymentId
        );

    const deleteError =
        useSelector(
            selectDeletePaymentError
        );

    // =================================================
    // LOCAL STATE
    // =================================================

    const [
        showDeleteError,
        setShowDeleteError,
    ] = useState(false);

    // =================================================
    // SAFETY
    // =================================================

    if (!payment) {
        return null;
    }

    // =================================================
    // PAYMENT ID
    // =================================================

    const paymentId = payment.id;

    // =================================================
    // DELETE STATE
    // =================================================

    const isDeleting =
        Number(deletingPaymentId) ===
        Number(paymentId);

    // =================================================
    // ORDER
    // =================================================

    const order =
        payment?.order || null;

    // =================================================
    // ORDER NUMBER
    // =================================================

    const orderNumber =
        order?.order_number ||
        order?.orderNumber ||
        order?.id ||
        payment.order_id ||
        "N/A";

    // =================================================
    // ORDER PRICING
    // =================================================

    const subtotalAmount =
        getNumber(
            order?.subtotal_amount
        );

    const discountAmount =
        getNumber(
            order?.discount_amount
        ) ?? 0;

    const orderTotal =
        getNumber(
            order?.total_amount
        );

    // =================================================
    // COUPON
    // =================================================

    const couponCode =
        order?.coupon_code ||
        order?.coupon?.code ||
        order?.coupon?.coupon_code ||
        null;

    // =================================================
    // FINAL PAYMENT AMOUNT
    // =================================================
    //
    // Priority:
    //
    // 1. order.total_amount
    //    This is the final saved order amount.
    //
    // 2. payment.amount
    //    Fallback for older orders / responses.
    //

    const finalAmount =
        orderTotal !== null
            ? orderTotal
            : (
                getNumber(
                    payment.amount
                ) ?? 0
            );

    // =================================================
    // PAYMENT METHOD
    // =================================================

    const paymentMethod =
        payment.payment_method ||
        payment.method ||
        "N/A";

    const formattedPaymentMethod =
        String(paymentMethod)
            .replace(/_/g, " ");

    // =================================================
    // TRANSACTION ID
    // =================================================

    const transactionId =
        payment.transaction_id ||
        payment.transactionId ||
        "Not generated";

    // =================================================
    // DELETE PAYMENT
    // =================================================

    const handleDelete = async (
        event
    ) => {
        event.stopPropagation();

        if (!paymentId) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this payment history?"
            );

        if (!confirmed) {
            return;
        }

        setShowDeleteError(false);

        try {
            await dispatch(
                deletePayment(paymentId)
            ).unwrap();
        } catch (error) {
            console.error(
                "DELETE PAYMENT ERROR:",
                error
            );

            setShowDeleteError(true);
        }
    };

    // =================================================
    // PREVENT CARD CLICK
    // =================================================

    const handleDeleteAreaClick = (
        event
    ) => {
        event.stopPropagation();
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Card
            variant="outlined"
            elevation={0}
            sx={{
                borderRadius: 3,

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    transform:
                        "translateY(-2px)",
                    boxShadow: 2,
                },

                opacity:
                    isDeleting ? 0.6 : 1,
            }}
        >
            <CardContent>
                <Stack spacing={2}>

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
                        spacing={2}
                    >

                        {/* PAYMENT INFORMATION */}

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >
                            <Box
                                sx={{
                                    width: 45,
                                    height: 45,
                                    minWidth: 45,
                                    borderRadius: 2,

                                    backgroundColor:
                                        "primary.50",

                                    color:
                                        "primary.main",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",
                                }}
                            >
                                <CreditCard />
                            </Box>

                            <Box>
                                <Typography
                                    fontWeight={700}
                                >
                                    Payment
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {formatDate(
                                        payment.created_at
                                    )}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* STATUS + DELETE */}

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            onClick={
                                handleDeleteAreaClick
                            }
                        >
                            <PaymentStatus
                                status={
                                    payment.status
                                }
                            />

                            <Tooltip
                                title={
                                    isDeleting
                                        ? "Deleting..."
                                        : "Delete payment"
                                }
                            >
                                <span>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="Delete payment"
                                        disabled={
                                            isDeleting
                                        }
                                        onClick={
                                            handleDelete
                                        }
                                        sx={{
                                            border:
                                                "1px solid",

                                            borderColor:
                                                "error.light",

                                            "&:hover": {
                                                backgroundColor:
                                                    "error.50",
                                            },
                                        }}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    {/* =================================
                        DELETE ERROR
                    ================================== */}

                    {showDeleteError &&
                        deleteError && (
                            <Typography
                                variant="body2"
                                color="error"
                                fontWeight={600}
                            >
                                {deleteError}
                            </Typography>
                        )}

                    <Divider />

                    {/* =================================
                        PAYMENT DETAILS
                    ================================== */}

                    <Stack spacing={1.5}>

                        {/* ORDER */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Order
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                #{orderNumber}
                            </Typography>
                        </Stack>

                        {/* =================================
                            SUBTOTAL
                        ================================== */}

                        {subtotalAmount !== null && (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
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

                        {/* =================================
                            COUPON DISCOUNT
                        ================================== */}

                        {discountAmount > 0 && (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Typography
                                    color="success.main"
                                >
                                    Coupon Discount
                                    {couponCode
                                        ? ` (${couponCode})`
                                        : ""}
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    color="success.main"
                                >
                                    - Rs.{" "}
                                    {formatPrice(
                                        discountAmount
                                    )}
                                </Typography>
                            </Stack>
                        )}

                        {/* =================================
                            FINAL AMOUNT
                        ================================== */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Amount
                            </Typography>

                            <Typography
                                fontWeight={700}
                                color="primary"
                            >
                                Rs.{" "}
                                {formatPrice(
                                    finalAmount
                                )}
                            </Typography>
                        </Stack>

                        {/* =================================
                            METHOD
                        ================================== */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Method
                            </Typography>

                            <Typography
                                fontWeight={600}
                                sx={{
                                    textTransform:
                                        "capitalize",
                                }}
                            >
                                {
                                    formattedPaymentMethod
                                }
                            </Typography>
                        </Stack>

                        {/* =================================
                            TRANSACTION ID
                        ================================== */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Transaction ID
                            </Typography>

                            <Typography
                                fontWeight={600}
                                sx={{
                                    maxWidth:
                                        "55%",
                                    overflow:
                                        "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap",
                                }}
                                title={
                                    transactionId
                                }
                            >
                                {transactionId}
                            </Typography>
                        </Stack>

                        {/* =================================
                            PAID AT
                        ================================== */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
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
                        FOOTER
                    ================================== */}

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <ReceiptLong
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Payment ID:{" "}
                            {payment.id ||
                                "N/A"}
                        </Typography>
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

PaymentCard.propTypes = {
    payment: PropTypes.object,
};

// =====================================================
// EXPORT
// =====================================================

export default PaymentCard;

