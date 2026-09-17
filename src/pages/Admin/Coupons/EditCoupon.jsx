// src/pages/Admin/Coupons/EditCoupon.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { toast } from "react-hot-toast";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import CouponForm from "../../../components/admin/coupon/CouponForm";

import {
    getCoupon,
    updateCoupon,
    clearCouponMessage,
    clearCoupon,
} from "../../../redux/admin/couponSlice";

const EditCoupon = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        coupon,
        loading,
        error,
        successMessage,
    } = useSelector(
        (state) =>
            state.adminCoupon
    );

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        code: "",
        type: "percentage",
        value: "",
        min_order_amount: "",
        max_discount: "",
        usage_limit: "",
        start_date: "",
        end_date: "",
        status: true,

        // Admin coupon scope
        admin_coupon_scope:
            "admin_only",
    });

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
    // FILL FORM
    // =====================================================

    useEffect(() => {
        if (!coupon) {
            return;
        }

        setFormData({
            code:
                coupon.code || "",

            type:
                coupon.type ||
                "percentage",

            value:
                coupon.value ??
                "",

            min_order_amount:
                coupon.min_order_amount ??
                "",

            max_discount:
                coupon.max_discount ??
                "",

            usage_limit:
                coupon.usage_limit ??
                "",

            start_date:
                coupon.start_date
                    ? coupon.start_date.substring(
                          0,
                          10
                      )
                    : "",

            end_date:
                coupon.end_date
                    ? coupon.end_date.substring(
                          0,
                          10
                      )
                    : "",

            status: Boolean(
                coupon.status
            ),

            // =================================================
            // LOAD ADMIN COUPON SCOPE
            //
            // Old records without a scope default to admin_only.
            // =================================================

            admin_coupon_scope:
                coupon.admin_coupon_scope ||
                "admin_only",
        });
    }, [coupon]);

    // =====================================================
    // REDIRECT AFTER SUCCESS
    // =====================================================

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        toast.success(
            "Coupon updated successfully."
        );

        dispatch(
            clearCouponMessage()
        );

        navigate(
            "/admin/coupons"
        );
    }, [
        successMessage,
        dispatch,
        navigate,
    ]);

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (e) => {
        e.preventDefault();

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            !formData.code.trim()
        ) {
            toast.error(
                "Coupon code is required."
            );
            return;
        }

        if (
            formData.value === "" ||
            Number(formData.value) < 0
        ) {
            toast.error(
                "Please enter a valid coupon value."
            );
            return;
        }

        if (
            formData.type ===
                "percentage" &&
            Number(formData.value) > 100
        ) {
            toast.error(
                "Percentage discount cannot exceed 100%."
            );
            return;
        }

        if (
            !formData.start_date ||
            !formData.end_date
        ) {
            toast.error(
                "Start date and end date are required."
            );
            return;
        }

        if (
            new Date(
                formData.end_date
            ) <
            new Date(
                formData.start_date
            )
        ) {
            toast.error(
                "End date must be after or equal to start date."
            );
            return;
        }

        if (
            !formData.admin_coupon_scope
        ) {
            toast.error(
                "Coupon scope is required."
            );
            return;
        }

        // =================================================
        // UPDATE PAYLOAD
        // =================================================

        const couponData = {
            code:
                formData.code
                    .trim()
                    .toUpperCase(),

            type:
                formData.type,

            value:
                Number(
                    formData.value
                ),

            min_order_amount:
                formData.min_order_amount ===
                ""
                    ? null
                    : Number(
                          formData.min_order_amount
                      ),

            max_discount:
                formData.type ===
                    "percentage" &&
                formData.max_discount !==
                    ""
                    ? Number(
                          formData.max_discount
                      )
                    : null,

            usage_limit:
                formData.usage_limit ===
                ""
                    ? null
                    : Number(
                          formData.usage_limit
                      ),

            start_date:
                formData.start_date,

            end_date:
                formData.end_date,

            status: Boolean(
                formData.status
            ),

            // =================================================
            // IMPORTANT
            // Admin coupon scope is sent.
            //
            // vendor_id is NOT sent.
            // =================================================

            admin_coupon_scope:
                formData.admin_coupon_scope,
        };

        console.log(
            "UPDATE ADMIN COUPON PAYLOAD:",
            couponData
        );

        dispatch(
            updateCoupon({
                id,
                couponData,
            })
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading &&
        !coupon
    ) {
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
    // RENDER
    // =====================================================

    return (
        <Container maxWidth="md">

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Edit Admin Coupon
            </Typography>

            <Card>

                <CardContent>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <CouponForm
                        formData={
                            formData
                        }
                        setFormData={
                            setFormData
                        }
                        onSubmit={
                            handleSubmit
                        }
                        loading={
                            loading
                        }
                    />

                </CardContent>

            </Card>

        </Container>
    );
};

export default EditCoupon;