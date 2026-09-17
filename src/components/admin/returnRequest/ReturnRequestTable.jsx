import PropTypes from "prop-types";

import {
    Box,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const ReturnRequestTable = ({
    returnRequests = [],
    onView,
    onEdit,
    onDelete,
}) => {
    if (!returnRequests.length) {
        return (
            <Paper sx={{ p: 5 }}>
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No return requests found.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 2,
                overflowX: "auto",
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Customer</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Product</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Reason</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Refund</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Date</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {returnRequests.map((request) => (
                        <TableRow
                            hover
                            key={request.id}
                        >
                            <TableCell>
                                #{request.id}
                            </TableCell>

                            <TableCell>
                                {request.user?.name ||
                                    `User #${request.user_id}`}
                            </TableCell>

                            <TableCell>
                                #{request.order_id}
                            </TableCell>

                            <TableCell>
                                {request.orderItem?.product
                                    ?.name || "-"}
                            </TableCell>

                            <TableCell
                                sx={{
                                    maxWidth: 250,
                                }}
                            >
                                <Tooltip
                                    title={
                                        request.reason ||
                                        ""
                                    }
                                >
                                    <Typography
                                        variant="body2"
                                        noWrap
                                    >
                                        {request.reason ||
                                            "-"}
                                    </Typography>
                                </Tooltip>
                            </TableCell>

                            <TableCell>
                                {formatCurrency(
                                    request.refund_amount
                                )}
                            </TableCell>

                            <TableCell>
                                <Chip
                                    size="small"
                                    label={
                                        request.status ||
                                        "pending"
                                    }
                                    color={getStatusColor(
                                        request.status
                                    )}
                                    sx={{
                                        textTransform:
                                            "capitalize",
                                    }}
                                />
                            </TableCell>

                            <TableCell>
                                {formatDate(
                                    request.created_at
                                )}
                            </TableCell>

                            <TableCell align="center">
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={0.5}
                                >
                                    <Tooltip title="View">
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onView(
                                                    request.id
                                                )
                                            }
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                onEdit(
                                                    request.id
                                                )
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete(
                                                    request.id
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ReturnRequestTable.propTypes = {
    returnRequests: PropTypes.array,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ReturnRequestTable;