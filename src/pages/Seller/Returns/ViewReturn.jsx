import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    getReturnRequest,
    clearReturnRequest,
    clearReturnError,
} from "../../../redux/seller/sellerReturnSlice";

const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return "success";

        case "rejected":
            return "error";

        case "refunded":
            return "info";

        case "pending":
        default:
            return "warning";
    }
};

const formatCurrency = (amount) => {
    if (
        amount === null ||
        amount === undefined ||
        amount === ""
    ) {
        return "-";
    }

    const number = Number(amount);

    if (Number.isNaN(number)) {
        return "-";
    }

    return `Rs. ${number.toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const DetailRow = ({ label, children }) => {
    return (
        <Grid
            container
            spacing={2}
            sx={{ mb: 2 }}
        >
            <Grid item xs={12} sm={4}>
                <Typography fontWeight={600}>
                    {label}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
                {children}
            </Grid>
        </Grid>
    );
};

const TextValue = ({ value }) => {
    return (
        <Typography color="text.secondary">
            {value !== null &&
            value !== undefined &&
            value !== ""
                ? value
                : "-"}
        </Typography>
    );
};

const ViewReturn = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        returnRequest,
        loading,
        error,
    } = useSelector(
        (state) => state.sellerReturn || {}
    );

    useEffect(() => {
        if (id) {
            dispatch(getReturnRequest(id));
        }

        return () => {
            dispatch(clearReturnRequest());
            dispatch(clearReturnError());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress size={45} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Stack spacing={2}>
                    <Alert severity="error">
                        {error}
                    </Alert>

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(
                                "/seller/returns"
                            )
                        }
                    >
                        Back to Returns
                    </Button>
                </Stack>
            </Box>
        );
    }

    if (!returnRequest) {
        return (
            <Box p={3}>
                <Alert severity="warning">
                    Return request not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={() =>
                        navigate(
                            "/seller/returns"
                        )
                    }
                >
                    Back to Returns
                </Button>
            </Box>
        );
    }

    const product =
        returnRequest.orderItem?.product ||
        returnRequest.order_item?.product;

    const orderItem =
        returnRequest.orderItem ||
        returnRequest.order_item;

    return (
        <Box p={3}>
            {/* Header */}

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
                        fontWeight={700}
                    >
                        Return Request Details
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={0.5}
                    >
                        Return #
                        {returnRequest.id}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={() =>
                        navigate(
                            "/seller/returns"
                        )
                    }
                >
                    Back
                </Button>
            </Stack>

            <Card elevation={3}>
                <CardContent>
                    {/* Return Information */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Return Information
                    </Typography>

                    <Divider
                        sx={{ mb: 3 }}
                    />

                    <DetailRow label="Return ID">
                        <TextValue
                            value={`#${returnRequest.id}`}
                        />
                    </DetailRow>

                    <DetailRow label="Status">
                        <Chip
                            label={
                                returnRequest.status ||
                                "pending"
                            }
                            color={getStatusColor(
                                returnRequest.status
                            )}
                            size="small"
                            sx={{
                                textTransform:
                                    "capitalize",
                            }}
                        />
                    </DetailRow>

                    <DetailRow label="Refund Amount">
                        <Typography
                            color="primary"
                            fontWeight={700}
                        >
                            {formatCurrency(
                                returnRequest.refund_amount
                            )}
                        </Typography>
                    </DetailRow>

                    <DetailRow label="Reason">
                        <TextValue
                            value={
                                returnRequest.reason
                            }
                        />
                    </DetailRow>

                    <DetailRow label="Admin Note">
                        <TextValue
                            value={
                                returnRequest.admin_note
                            }
                        />
                    </DetailRow>

                    <Divider
                        sx={{ my: 3 }}
                    />

                    {/* Customer */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Customer Information
                    </Typography>

                    <Divider
                        sx={{ mb: 3 }}
                    />

                    <DetailRow label="Customer">
                        <TextValue
                            value={
                                returnRequest
                                    .user?.name
                            }
                        />
                    </DetailRow>

                    <DetailRow label="Email">
                        <TextValue
                            value={
                                returnRequest
                                    .user?.email
                            }
                        />
                    </DetailRow>

                    <DetailRow label="User ID">
                        <TextValue
                            value={
                                returnRequest.user_id
                            }
                        />
                    </DetailRow>

                    <Divider
                        sx={{ my: 3 }}
                    />

                    {/* Order */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Order Information
                    </Typography>

                    <Divider
                        sx={{ mb: 3 }}
                    />

                    <DetailRow label="Order ID">
                        <TextValue
                            value={`#${returnRequest.order_id}`}
                        />
                    </DetailRow>

                    <DetailRow label="Order Status">
                        <TextValue
                            value={
                                returnRequest
                                    .order?.status
                            }
                        />
                    </DetailRow>

                    <DetailRow label="Order Item ID">
                        <TextValue
                            value={
                                returnRequest
                                    .order_item_id
                            }
                        />
                    </DetailRow>

                    <Divider
                        sx={{ my: 3 }}
                    />

                    {/* Product */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Product Information
                    </Typography>

                    <Divider
                        sx={{ mb: 3 }}
                    />

                    <DetailRow label="Product">
                        <TextValue
                            value={
                                product?.name
                            }
                        />
                    </DetailRow>

                    <DetailRow label="Product ID">
                        <TextValue
                            value={
                                product?.id
                            }
                        />
                    </DetailRow>

                    <DetailRow label="Quantity">
                        <TextValue
                            value={
                                orderItem?.quantity
                            }
                        />
                    </DetailRow>

                    <DetailRow label="Unit Price">
                        <TextValue
                            value={formatCurrency(
                                orderItem?.price
                            )}
                        />
                    </DetailRow>

                    <DetailRow label="Total">
                        <TextValue
                            value={formatCurrency(
                                orderItem?.total
                            )}
                        />
                    </DetailRow>

                    <Divider
                        sx={{ my: 3 }}
                    />

                    {/* Dates */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Timestamps
                    </Typography>

                    <Divider
                        sx={{ mb: 3 }}
                    />

                    <DetailRow label="Requested At">
                        <TextValue
                            value={formatDate(
                                returnRequest.created_at
                            )}
                        />
                    </DetailRow>

                    <DetailRow label="Last Updated">
                        <TextValue
                            value={formatDate(
                                returnRequest.updated_at
                            )}
                        />
                    </DetailRow>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ViewReturn;