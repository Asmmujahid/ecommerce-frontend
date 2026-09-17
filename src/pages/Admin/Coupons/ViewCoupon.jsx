// src/pages/Admin/Coupons/ViewCoupon.jsx

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    getCoupon,
    clearCoupon,
} from "../../../redux/admin/couponSlice";

const ViewCoupon = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        coupon,
        loading,
        error,
    } = useSelector(
        (state) =>
            state.adminCoupon
    );

    // =====================================================
    // LOAD COUPON
    // =====================================================

    useEffect(() => {
        dispatch(
            getCoupon(id)
        );

        return () => {
            dispatch(
                clearCoupon()
            );
        };
    }, [
        dispatch,
        id,
    ]);

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

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
    // FORMAT SCOPE
    // =====================================================

    const formatScope = () => {
        if (
            coupon?.admin_coupon_scope ===
            "all_products"
        ) {
            return "All Products";
        }

        if (
            coupon?.admin_coupon_scope ===
            "admin_only"
        ) {
            return "Admin Products Only";
        }

        return "-";
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!coupon) {
        return (
            <Container maxWidth="md">
                <Alert severity="warning">
                    Coupon not found.
                </Alert>
            </Container>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Container maxWidth="md">

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
                mb={3}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Coupon Details
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/coupons"
                            )
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={() =>
                            navigate(
                                `/admin/coupons/edit/${coupon.id}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>

            {/* =================================================
                DETAILS
            ================================================= */}

            <Card>

                <CardContent>

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* CODE */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Coupon Code
                            </Typography>

                            <Typography
                                variant="h6"
                            >
                                {coupon.code}
                            </Typography>
                        </Grid>

                        {/* STATUS */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Chip
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
                        </Grid>

                        {/* =================================================
                            SCOPE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Coupon Scope
                            </Typography>

                            <Chip
                                label={formatScope()}
                                color={
                                    coupon.admin_coupon_scope ===
                                    "all_products"
                                        ? "success"
                                        : "primary"
                                }
                            />
                        </Grid>

                        {/* TYPE */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Coupon Type
                            </Typography>

                            <Typography>
                                {coupon.type ===
                                "percentage"
                                    ? "Percentage"
                                    : "Fixed Amount"}
                            </Typography>
                        </Grid>

                        {/* VALUE */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Value
                            </Typography>

                            <Typography>
                                {coupon.type ===
                                "percentage"
                                    ? `${coupon.value}%`
                                    : `Rs. ${coupon.value}`}
                            </Typography>
                        </Grid>

                        {/* MINIMUM ORDER */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Minimum Order
                            </Typography>

                            <Typography>
                                {coupon.min_order_amount ??
                                    "-"}
                            </Typography>
                        </Grid>

                        {/* MAX DISCOUNT */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Maximum Discount
                            </Typography>

                            <Typography>
                                {coupon.max_discount ??
                                    "-"}
                            </Typography>
                        </Grid>

                        {/* USAGE LIMIT */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Usage Limit
                            </Typography>

                            <Typography>
                                {coupon.usage_limit ??
                                    "Unlimited"}
                            </Typography>
                        </Grid>

                        {/* USED COUNT */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Used Count
                            </Typography>

                            <Typography>
                                {coupon.used_count ??
                                    0}
                            </Typography>
                        </Grid>

                        {/* START DATE */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Start Date
                            </Typography>

                            <Typography>
                                {formatDate(
                                    coupon.start_date
                                )}
                            </Typography>
                        </Grid>

                        {/* END DATE */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                End Date
                            </Typography>

                            <Typography>
                                {formatDate(
                                    coupon.end_date
                                )}
                            </Typography>
                        </Grid>

                        {/* DIVIDER */}

                        <Grid
                            item
                            xs={12}
                        >
                            <Divider />
                        </Grid>

                        {/* CREATED */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Created At
                            </Typography>

                            <Typography>
                                {formatDate(
                                    coupon.created_at
                                )}
                            </Typography>
                        </Grid>

                        {/* UPDATED */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                Updated At
                            </Typography>

                            <Typography>
                                {formatDate(
                                    coupon.updated_at
                                )}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Container>
    );
};

export default ViewCoupon;