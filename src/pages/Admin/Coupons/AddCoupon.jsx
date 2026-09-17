// src/pages/Admin/Coupons/AddCoupon.jsx

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
} from "react-router-dom";

import { toast } from "react-hot-toast";

import {
    Alert,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";

import CouponForm from "../../../components/admin/coupon/CouponForm";

import {
    createCoupon,
    clearCouponMessage,
} from "../../../redux/admin/couponSlice";

const AddCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
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
    // REDIRECT AFTER SUCCESS
    // =====================================================

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        toast.success(
            "Coupon created successfully."
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
            !formData.start_date
        ) {
            toast.error(
                "Start date is required."
            );
            return;
        }

        if (
            !formData.end_date
        ) {
            toast.error(
                "End date is required."
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
        // PAYLOAD
        // =================================================

        const payload = {
            code: formData.code
                .trim()
                .toUpperCase(),

            type: formData.type,

            value: Number(
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
            // Admin coupon scope.
            //
            // vendor_id is intentionally NOT sent.
            // Backend forces vendor_id = NULL.
            // =================================================

            admin_coupon_scope:
                formData.admin_coupon_scope,
        };

        console.log(
            "CREATE ADMIN COUPON PAYLOAD:",
            payload
        );

        dispatch(
            createCoupon(payload)
        );
    };

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
                Add Admin Coupon
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
                        formData={formData}
                        setFormData={
                            setFormData
                        }
                        onSubmit={
                            handleSubmit
                        }
                        loading={loading}
                    />

                </CardContent>
            </Card>

        </Container>
    );
};

export default AddCoupon;