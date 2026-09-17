import { useNavigate } from "react-router-dom";

import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
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

const ReturnTable = ({
    rows = [],
    loading = false,
    onUpdateStatus,
}) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <Paper sx={{ p: 5 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                overflowX: "auto",
            }}
        >
            <Table
                sx={{
                    minWidth: 900,
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <strong>#</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Customer</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Product</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order ID</strong>
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

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                align="center"
                            >
                                <Typography
                                    py={4}
                                    color="text.secondary"
                                >
                                    No return requests
                                    found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map(
                            (item, index) => {
                                const product =
                                    item.orderItem
                                        ?.product ||
                                    item.order_item
                                        ?.product;

                                return (
                                    <TableRow
                                        key={
                                            item.id
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {index +
                                                1}
                                        </TableCell>

                                        <TableCell>
                                            <Stack
                                                spacing={
                                                    0.5
                                                }
                                            >
                                                <Typography
                                                    fontWeight={
                                                        600
                                                    }
                                                >
                                                    {item
                                                        .user
                                                        ?.name ||
                                                        `User #${item.user_id}`}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {item
                                                        .user
                                                        ?.email ||
                                                        "-"}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                fontWeight={
                                                    500
                                                }
                                            >
                                                {product
                                                    ?.name ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            #
                                            {
                                                item.order_id
                                            }
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                maxWidth: 220,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                noWrap
                                                title={
                                                    item.reason ||
                                                    ""
                                                }
                                            >
                                                {item.reason ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {formatCurrency(
                                                item.refund_amount
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    item.status ||
                                                    "pending"
                                                }
                                                color={getStatusColor(
                                                    item.status
                                                )}
                                                size="small"
                                                sx={{
                                                    textTransform:
                                                        "capitalize",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack
                                                direction="row"
                                                spacing={
                                                    1
                                                }
                                                justifyContent="center"
                                            >
                                                <Tooltip title="View">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            navigate(
                                                                `/seller/returns/${item.id}`
                                                            )
                                                        }
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                {item.status ===
                                                    "pending" && (
                                                    <Tooltip title="Update Status">
                                                        <IconButton
                                                            color="warning"
                                                            onClick={() =>
                                                                onUpdateStatus(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReturnTable;