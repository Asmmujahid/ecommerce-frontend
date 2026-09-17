// src/components/admin/coupon/CouponTable.jsx

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

import {
    Visibility,
    Edit,
    Delete,
} from "@mui/icons-material";

const CouponTable = ({
    coupons = [],
    onView = () => {},
    onEdit = () => {},
    onDelete = () => {},
}) => {
    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString();
    };

    // =====================================================
    // FORMAT VALUE
    // =====================================================

    const formatValue = (coupon) => {
        if (
            coupon.type ===
            "percentage"
        ) {
            return `${coupon.value}%`;
        }

        return `Rs. ${coupon.value}`;
    };

    // =====================================================
    // FORMAT SCOPE
    // =====================================================

    const formatScope = (coupon) => {
        if (
            coupon.admin_coupon_scope ===
            "all_products"
        ) {
            return "All Products";
        }

        if (
            coupon.admin_coupon_scope ===
            "admin_only"
        ) {
            return "Admin Products Only";
        }

        return "-";
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <TableContainer
            component={Paper}
        >
            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Coupon Code
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Scope
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Type
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Value
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Min Order
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Max Discount
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Usage Limit
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Used
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Start Date
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                End Date
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Status
                            </strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>
                                Actions
                            </strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {coupons.length === 0 ? (
                        <TableRow>

                            <TableCell
                                colSpan={13}
                                align="center"
                            >
                                <Box py={5}>
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        No coupons found
                                    </Typography>
                                </Box>
                            </TableCell>

                        </TableRow>
                    ) : (
                        coupons.map(
                            (coupon) => (
                                <TableRow
                                    key={
                                        coupon.id
                                    }
                                    hover
                                >

                                    {/* ID */}

                                    <TableCell>
                                        {
                                            coupon.id
                                        }
                                    </TableCell>

                                    {/* CODE */}

                                    <TableCell>
                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                coupon.code
                                            }
                                        </Typography>
                                    </TableCell>

                                    {/* SCOPE */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={formatScope(
                                                coupon
                                            )}
                                            color={
                                                coupon.admin_coupon_scope ===
                                                "all_products"
                                                    ? "success"
                                                    : "primary"
                                            }
                                        />
                                    </TableCell>

                                    {/* TYPE */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={
                                                coupon.type ===
                                                "percentage"
                                                    ? "Percentage"
                                                    : "Fixed"
                                            }
                                            color={
                                                coupon.type ===
                                                "percentage"
                                                    ? "primary"
                                                    : "secondary"
                                            }
                                        />
                                    </TableCell>

                                    {/* VALUE */}

                                    <TableCell>
                                        {formatValue(
                                            coupon
                                        )}
                                    </TableCell>

                                    {/* MIN ORDER */}

                                    <TableCell>
                                        {coupon.min_order_amount ??
                                            "-"}
                                    </TableCell>

                                    {/* MAX DISCOUNT */}

                                    <TableCell>
                                        {coupon.max_discount ??
                                            "-"}
                                    </TableCell>

                                    {/* USAGE LIMIT */}

                                    <TableCell>
                                        {coupon.usage_limit ??
                                            "Unlimited"}
                                    </TableCell>

                                    {/* USED */}

                                    <TableCell>
                                        {coupon.used_count ??
                                            0}
                                    </TableCell>

                                    {/* START DATE */}

                                    <TableCell>
                                        {formatDate(
                                            coupon.start_date
                                        )}
                                    </TableCell>

                                    {/* END DATE */}

                                    <TableCell>
                                        {formatDate(
                                            coupon.end_date
                                        )}
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={
                                                coupon.status
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            color={
                                                coupon.status
                                                    ? "success"
                                                    : "error"
                                            }
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell align="center">

                                        <Tooltip title="View">
                                            <IconButton
                                                color="info"
                                                onClick={() =>
                                                    onView(
                                                        coupon.id
                                                    )
                                                }
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onEdit(
                                                        coupon.id
                                                    )
                                                }
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(
                                                        coupon.id
                                                    )
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>

                                    </TableCell>

                                </TableRow>
                            )
                        )
                    )}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default CouponTable;