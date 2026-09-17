import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return "success";

        case "pending":
            return "warning";

        case "rejected":
            return "error";

        case "refunded":
            return "info";

        default:
            return "default";
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

    return `Rs. ${number.toLocaleString()}`;
};

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const DetailItem = ({
    label,
    value,
}) => {
    return (
        <Box mb={2}>
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={0.5}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value !== null &&
                value !== undefined &&
                value !== ""
                    ? value
                    : "-"}
            </Typography>
        </Box>
    );
};

const ReturnRequestView = ({
    request,
}) => {
    if (!request) {
        return null;
    }

    const product =
        request.orderItem?.product;

    const variant =
        request.orderItem?.productVariant;

    return (
        <Card elevation={3}>
            <CardContent>
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
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <AssignmentReturnIcon
                            color="primary"
                            fontSize="large"
                        />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                            >
                                Return Request #
                                {request.id}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Created{" "}
                                {formatDate(
                                    request.created_at
                                )}
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        label={
                            request.status ||
                            "unknown"
                        }
                        color={getStatusColor(
                            request.status
                        )}
                        sx={{
                            textTransform:
                                "capitalize",
                            fontWeight: 600,
                        }}
                    />
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >
                    {/* CUSTOMER */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb={2}
                        >
                            <PersonIcon color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Customer
                            </Typography>
                        </Stack>

                        <DetailItem
                            label="User ID"
                            value={
                                request.user_id
                            }
                        />

                        <DetailItem
                            label="Customer Name"
                            value={
                                request.user?.name
                            }
                        />

                        <DetailItem
                            label="Email"
                            value={
                                request.user?.email
                            }
                        />
                    </Grid>

                    {/* ORDER */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb={2}
                        >
                            <ShoppingCartIcon color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Order
                            </Typography>
                        </Stack>

                        <DetailItem
                            label="Order ID"
                            value={
                                request.order_id
                                    ? `#${request.order_id}`
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Order Item ID"
                            value={
                                request.order_item_id
                            }
                        />

                        <DetailItem
                            label="Order Status"
                            value={
                                request.order?.status
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                    >
                        <Divider />
                    </Grid>

                    {/* PRODUCT */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb={2}
                        >
                            <Inventory2Icon color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Product
                            </Typography>
                        </Stack>

                        <DetailItem
                            label="Product Name"
                            value={
                                product?.name
                            }
                        />

                        <DetailItem
                            label="Product ID"
                            value={
                                product?.id
                            }
                        />

                        <DetailItem
                            label="Variant"
                            value={
                                variant?.name ||
                                variant?.sku ||
                                variant?.id
                                    ? variant?.name ||
                                      variant?.sku ||
                                      `Variant #${variant?.id}`
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Quantity"
                            value={
                                request.orderItem
                                    ?.quantity
                            }
                        />
                    </Grid>

                    {/* REFUND */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb={2}
                        >
                            <MonetizationOnIcon color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Refund
                            </Typography>
                        </Stack>

                        <DetailItem
                            label="Refund Amount"
                            value={formatCurrency(
                                request.refund_amount
                            )}
                        />

                        <DetailItem
                            label="Status"
                            value={
                                request.status
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                    >
                        <Divider />
                    </Grid>

                    {/* REASON */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Return Reason
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor:
                                    "background.default",
                            }}
                        >
                            <Typography>
                                {request.reason ||
                                    "-"}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* ADMIN NOTE */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Admin Note
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor:
                                    "background.default",
                            }}
                        >
                            <Typography>
                                {request.admin_note ||
                                    "-"}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* DATES */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <DetailItem
                            label="Created At"
                            value={formatDate(
                                request.created_at
                            )}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <DetailItem
                            label="Updated At"
                            value={formatDate(
                                request.updated_at
                            )}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

DetailItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
};

ReturnRequestView.propTypes = {
    request: PropTypes.object,
};

export default ReturnRequestView;