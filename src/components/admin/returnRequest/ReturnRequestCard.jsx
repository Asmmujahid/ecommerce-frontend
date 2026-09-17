import PropTypes from "prop-types";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

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
    if (amount === null || amount === undefined) {
        return "-";
    }

    return `Rs. ${Number(amount).toLocaleString()}`;
};

const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const ReturnRequestCard = ({
    request,
    onView,
    onEdit,
    onDelete,
}) => {
    if (!request) return null;

    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 3,
            }}
        >
            <CardContent>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <AssignmentReturnIcon color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Request #{request.id}
                        </Typography>
                    </Stack>

                    <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{
                            textTransform: "capitalize",
                        }}
                    />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.5}>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Customer
                        </Typography>

                        <Typography fontWeight={500}>
                            {request.user?.name ??
                                `User #${request.user_id}`}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order
                        </Typography>

                        <Typography fontWeight={500}>
                            #{request.order_id}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product
                        </Typography>

                        <Typography fontWeight={500}>
                            {request.orderItem?.product?.name ??
                                "-"}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Return Reason
                        </Typography>

                        <Typography>
                            {request.reason}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Refund Amount
                        </Typography>

                        <Typography
                            color="primary"
                            fontWeight="bold"
                        >
                            {formatCurrency(
                                request.refund_amount
                            )}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Admin Note
                        </Typography>

                        <Typography>
                            {request.admin_note || "-"}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created
                        </Typography>

                        <Typography>
                            {formatDate(
                                request.created_at
                            )}
                        </Typography>
                    </Box>

                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                            onView(request.id)
                        }
                    >
                        View
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        color="warning"
                        startIcon={<EditIcon />}
                        onClick={() =>
                            onEdit(request.id)
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                            onDelete(request.id)
                        }
                    >
                        Delete
                    </Button>

                </Stack>

            </CardContent>
        </Card>
    );
};

ReturnRequestCard.propTypes = {
    request: PropTypes.object.isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ReturnRequestCard;