import { Link } from "react-router-dom";

import {
    TableRow,
    TableCell,
    IconButton,
    Chip,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const OrderRow = ({ order, onDelete }) => {
    //---------------------------------------
    // Status Color
    //---------------------------------------

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";

            case "processing":
                return "info";

            case "shipped":
                return "primary";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };

    //---------------------------------------
    // Payment Color
    //---------------------------------------

    const getPaymentColor = (status) => {
        switch (status) {
            case "paid":
                return "success";

            case "pending":
                return "warning";

            case "failed":
                return "error";

            default:
                return "default";
        }
    };

    //---------------------------------------

    return (
        <TableRow hover>

            {/* Order Number */}

            <TableCell>
                <Typography fontWeight={600}>
                    {order.order_number || `#${order.id}`}
                </Typography>
            </TableCell>

            {/* Customer */}

            <TableCell>
                {order.user?.name || "-"}
            </TableCell>

            {/* Email */}

            <TableCell>
                {order.user?.email || "-"}
            </TableCell>

            {/* Total */}

            <TableCell align="center">
                Rs.
                {Number(order.total_amount || 0).toLocaleString()}
            </TableCell>

            {/* Status */}

            <TableCell align="center">
                <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                />
            </TableCell>

            {/* Payment */}

            <TableCell align="center">
                <Chip
                    label={order.payment_status}
                    color={getPaymentColor(order.payment_status)}
                    size="small"
                />
            </TableCell>

            {/* Created */}

            <TableCell>
                {new Date(
                    order.created_at
                ).toLocaleDateString()}
            </TableCell>

            {/* Actions */}

            <TableCell align="center">

                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                >

                    <Tooltip title="View">

                        <IconButton
                            color="primary"
                            component={Link}
                            to={`/admin/orders/${order.id}`}
                        >
                            <VisibilityIcon />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton
                            color="warning"
                            component={Link}
                            to={`/admin/orders/${order.id}/edit`}
                        >
                            <EditIcon />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Delete">

                        <IconButton
                            color="error"
                            onClick={() =>
                                onDelete(order)
                            }
                        >
                            <DeleteIcon />
                        </IconButton>

                    </Tooltip>

                </Stack>

            </TableCell>

        </TableRow>
    );
};

export default OrderRow;