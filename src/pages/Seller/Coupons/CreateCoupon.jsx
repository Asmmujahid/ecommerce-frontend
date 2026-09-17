// src/pages/Seller/Coupons/CreateCoupon.jsx

import { useEffect } from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import {
    useNavigate,
    Link,
} from "react-router-dom";
import toast from "react-hot-toast";

import CouponForm from "./CouponForm";

import {
    createCoupon,
    resetSellerCouponState,
} from "../../../redux/seller/sellerCouponSlice";

const CreateCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading = false,
        success = false,
        error = null,
        message = "",
    } = useSelector(
        (state) =>
            state.sellerCoupon || {}
    );

    /*
    |--------------------------------------------------------------------------
    | Success & Error
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (success) {
            toast.success(
                message ||
                    "Coupon created successfully."
            );

            dispatch(
                resetSellerCouponState()
            );

            navigate("/seller/coupons");
        }
    }, [
        success,
        message,
        dispatch,
        navigate,
    ]);

    useEffect(() => {
        if (error) {
            toast.error(error);

            dispatch(
                resetSellerCouponState()
            );
        }
    }, [error, dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (data) => {
        dispatch(createCoupon(data));
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="p-6">
            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Create Store Coupon
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Create a discount coupon for
                        products belonging to your
                        store.
                    </p>
                </div>

                <Link
                    to="/seller/coupons"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg"
                >
                    Back
                </Link>
            </div>

            {/* Form */}

            <CouponForm
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
};

export default CreateCoupon;