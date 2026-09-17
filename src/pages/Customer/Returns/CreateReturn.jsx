
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useLocation,
    useNavigate,
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
    TextField,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import {
    createReturnRequest,
    clearReturnError,
    clearReturnSuccess,
    selectReturnSubmitting,
    selectReturnSubmitError,
    selectReturnSuccess,
    selectReturnMessage,
} from "../../../redux/customer/returnRequestSlice";

// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// =====================================================
// COMPONENT
// =====================================================

const CreateReturn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // =================================================
    // LOCATION STATE
    // =================================================

    const navigationState =
        location.state || {};

    const orderId =
        navigationState.orderId ?? null;

    const orderItemId =
        navigationState.orderItemId ?? null;

    const product =
        navigationState.product ?? null;

    const quantity =
        navigationState.quantity ?? null;

    const price =
        navigationState.price ?? null;

    // =================================================
    // REDUX SELECTORS
    // =================================================

    const submitting = useSelector(
        selectReturnSubmitting
    );

    const submitError = useSelector(
        selectReturnSubmitError
    );

    const success = useSelector(
        selectReturnSuccess
    );

    const message = useSelector(
        selectReturnMessage
    );

    // =================================================
    // LOCAL STATE
    // =================================================

    const [reason, setReason] =
        useState("");

    const [validationError, setValidationError] =
        useState("");

    // =================================================
    // PRODUCT NAME
    // =================================================

    const productName =
        product?.name ||
        product?.title ||
        "Selected Product";

    // =================================================
    // PRODUCT IMAGE
    // =================================================

    const productImage =
        product?.image ||
        product?.thumbnail ||
        product?.images?.[0]?.image ||
        product?.images?.[0]?.url ||
        product?.images?.[0] ||
        null;

    // =================================================
    // CLEAR REDUX MESSAGES
    // =================================================

    useEffect(() => {
        dispatch(clearReturnError());
        dispatch(clearReturnSuccess());

        return () => {
            dispatch(clearReturnError());
            dispatch(clearReturnSuccess());
        };
    }, [dispatch]);

    // =================================================
    // SUCCESS REDIRECT
    // =================================================

    useEffect(() => {
        if (!success) {
            return;
        }

        const timer = setTimeout(() => {
            navigate("/customer/returns", {
                replace: true,
            });
        }, 1500);

        return () => {
            clearTimeout(timer);
        };
    }, [success, navigate]);

    // =================================================
    // VALIDATE NAVIGATION DATA
    // =================================================

    useEffect(() => {
        if (!orderId || !orderItemId) {
            setValidationError(
                "Invalid return request. Please select a product from your order."
            );
        } else {
            setValidationError("");
        }
    }, [orderId, orderItemId]);

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setValidationError("");

        // ---------------------------------------------
        // Order ID validation
        // ---------------------------------------------

        if (!orderId) {
            setValidationError(
                "Order information is missing. Please go back and select an order item."
            );

            return;
        }

        // ---------------------------------------------
        // Order item validation
        // ---------------------------------------------

        if (!orderItemId) {
            setValidationError(
                "Order item information is missing. Please go back and select a product."
            );

            return;
        }

        // ---------------------------------------------
        // Reason validation
        // ---------------------------------------------

        const trimmedReason =
            reason.trim();

        if (!trimmedReason) {
            setValidationError(
                "Please enter a reason for returning this product."
            );

            return;
        }

        if (trimmedReason.length < 5) {
            setValidationError(
                "Return reason must contain at least 5 characters."
            );

            return;
        }

        if (trimmedReason.length > 1000) {
            setValidationError(
                "Return reason cannot exceed 1000 characters."
            );

            return;
        }

        // Clear previous backend error
        dispatch(clearReturnError());

        // ---------------------------------------------
        // Submit request
        // ---------------------------------------------

        const result = await dispatch(
            createReturnRequest({
                order_id: Number(orderId),

                order_item_id:
                    Number(orderItemId),

                reason: trimmedReason,
            })
        );

        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        if (
            createReturnRequest.fulfilled.match(
                result
            )
        ) {
            setReason("");
        }
    };

    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {
        navigate(-1);
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Container
            maxWidth="md"
            sx={{
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

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
                sx={{
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Return Product
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Submit a return request for
                        your purchased product.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={handleBack}
                    disabled={submitting}
                >
                    Back
                </Button>
            </Stack>

            {/* =================================================
                VALIDATION ERROR
            ================================================= */}

            {validationError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                    onClose={() =>
                        setValidationError("")
                    }
                >
                    {validationError}
                </Alert>
            )}

            {/* =================================================
                SERVER ERROR
            ================================================= */}

            {submitError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                    onClose={() =>
                        dispatch(
                            clearReturnError()
                        )
                    }
                >
                    {submitError}
                </Alert>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                    }}
                >
                    {message ||
                        "Return request submitted successfully."}

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Redirecting to your return
                        requests...
                    </Typography>
                </Alert>
            )}

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <Card
                variant="outlined"
                elevation={0}
            >
                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 4,
                        },
                    }}
                >
                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            mb: 3,
                        }}
                    >
                        <AssignmentReturnIcon color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Return Request
                        </Typography>
                    </Stack>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    {product && (
                        <>
                            <Card
                                variant="outlined"
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    bgcolor:
                                        "background.default",
                                }}
                            >
                                <CardContent>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={2}
                                        alignItems={{
                                            xs: "flex-start",
                                            sm: "center",
                                        }}
                                    >
                                        {/* PRODUCT IMAGE */}

                                        {productImage ? (
                                            <Box
                                                component="img"
                                                src={
                                                    productImage
                                                }
                                                alt={
                                                    productName
                                                }
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit:
                                                        "contain",
                                                    borderRadius: 1,
                                                    border:
                                                        "1px solid",
                                                    borderColor:
                                                        "divider",
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    borderRadius: 1,
                                                    border:
                                                        "1px solid",
                                                    borderColor:
                                                        "divider",
                                                }}
                                            >
                                                <ShoppingBagIcon
                                                    fontSize="large"
                                                    color="disabled"
                                                />
                                            </Box>
                                        )}

                                        {/* PRODUCT DETAILS */}

                                        <Box>
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                            >
                                                {
                                                    productName
                                                }
                                            </Typography>

                                            {quantity !==
                                                null &&
                                                quantity !==
                                                    undefined && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        Quantity:{" "}
                                                        {
                                                            quantity
                                                        }
                                                    </Typography>
                                                )}

                                            {price !==
                                                null &&
                                                price !==
                                                    undefined && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        Price:{" "}
                                                        {formatCurrency(
                                                            price
                                                        )}
                                                    </Typography>
                                                )}
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Divider
                                sx={{
                                    mb: 3,
                                }}
                            />
                        </>
                    )}

                    {/* =================================================
                        ORDER INFORMATION
                    ================================================= */}

                    <Stack
                        spacing={2}
                        sx={{
                            mb: 3,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Order ID"
                            value={
                                orderId || ""
                            }
                            disabled
                        />

                        <TextField
                            fullWidth
                            label="Order Item ID"
                            value={
                                orderItemId || ""
                            }
                            disabled
                        />
                    </Stack>

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <Box
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={6}
                                label="Return Reason"
                                placeholder="Please explain why you want to return this product..."
                                value={reason}
                                onChange={(
                                    event
                                ) => {
                                    setReason(
                                        event.target
                                            .value
                                    );

                                    setValidationError(
                                        ""
                                    );

                                    if (
                                        submitError
                                    ) {
                                        dispatch(
                                            clearReturnError()
                                        );
                                    }
                                }}
                                disabled={
                                    submitting ||
                                    success
                                }
                                required
                                inputProps={{
                                    maxLength: 1000,
                                }}
                                helperText={`${reason.length}/1000 characters`}
                            />

                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <Stack
                                direction={{
                                    xs: "column-reverse",
                                    sm: "row",
                                }}
                                spacing={2}
                                justifyContent="flex-end"
                            >
                                <Button
                                    variant="outlined"
                                    onClick={
                                        handleBack
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="warning"
                                    disabled={
                                        submitting ||
                                        success ||
                                        !orderId ||
                                        !orderItemId
                                    }
                                    startIcon={
                                        submitting ? (
                                            <CircularProgress
                                                size={
                                                    18
                                                }
                                                color="inherit"
                                            />
                                        ) : (
                                            <AssignmentReturnIcon />
                                        )
                                    }
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Return Request"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CreateReturn;

