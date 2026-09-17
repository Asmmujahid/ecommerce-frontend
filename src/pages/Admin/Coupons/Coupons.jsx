// src/pages/Admin/Coupons/Coupons.jsx

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
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
    Stack,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import CouponTable from "../../../components/admin/coupon/CouponTable";

import {
    getCoupons,
    deleteCoupon,
    clearCouponMessage,
} from "../../../redux/admin/couponSlice";

const Coupons = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        coupons = [],
        loading,
        error,
        successMessage,
    } = useSelector(
        (state) =>
            state.adminCoupon
    );

    // =====================================================
    // GET COUPONS
    // =====================================================

    useEffect(() => {
        dispatch(
            getCoupons()
        );
    }, [dispatch]);

    // =====================================================
    // CLEAR SUCCESS MESSAGE
    // =====================================================

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timer =
            setTimeout(() => {
                dispatch(
                    clearCouponMessage()
                );
            }, 3000);

        return () =>
            clearTimeout(timer);
    }, [
        successMessage,
        dispatch,
    ]);

    // =====================================================
    // ADD
    // =====================================================

    const handleAddCoupon = () => {
        navigate(
            "/admin/coupons/create"
        );
    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (id) => {
        navigate(
            `/admin/coupons/view/${id}`
        );
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (id) => {
        navigate(
            `/admin/coupons/edit/${id}`
        );
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this coupon?"
            );

        if (!confirmed) {
            return;
        }

        dispatch(
            deleteCoupon(id)
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Container maxWidth="xl">

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
                    Admin Coupons
                </Typography>

                <Button
                    variant="contained"
                    startIcon={
                        <AddIcon />
                    }
                    onClick={
                        handleAddCoupon
                    }
                >
                    Add Coupon
                </Button>

            </Stack>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
                </Alert>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                TABLE
            ================================================= */}

            <Card>

                <CardContent>

                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            py={5}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <CouponTable
                            coupons={
                                coupons
                            }
                            onView={
                                handleView
                            }
                            onEdit={
                                handleEdit
                            }
                            onDelete={
                                handleDelete
                            }
                        />
                    )}

                </CardContent>

            </Card>

        </Container>
    );
};

export default Coupons;