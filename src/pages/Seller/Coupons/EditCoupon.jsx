// src/pages/Seller/Coupons/EditCoupon.jsx

import { useEffect } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import toast from "react-hot-toast";

import CouponForm from "./CouponForm";

import {
    getCoupon,
    updateCoupon,
    clearSelectedCoupon,
    resetSellerCouponState,
} from "../../../redux/seller/sellerCouponSlice";

const EditCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        coupon = null,
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
    | Load Coupon
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(getCoupon(id));

        return () => {
            dispatch(
                clearSelectedCoupon()
            );
        };
    }, [dispatch, id]);

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (success) {
            toast.success(
                message ||
                    "Coupon updated successfully."
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

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

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
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading && !coupon) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600 mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading coupon...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Not Found
    |--------------------------------------------------------------------------
    */

    if (!loading && !coupon) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl shadow p-10 text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        Coupon Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The requested coupon does
                        not exist or does not belong
                        to your store.
                    </p>

                    <Link
                        to="/seller/coupons"
                        className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Back to Coupons
                    </Link>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (data) => {
        if (!id) {
            toast.error(
                "Invalid coupon ID."
            );
            return;
        }

        dispatch(
            updateCoupon({
                id,
                data,
            })
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="p-6">
            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Edit Store Coupon
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update your store coupon
                        information.
                    </p>
                </div>

                <Link
                    to="/seller/coupons"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg"
                >
                    Back
                </Link>
            </div>

            {/* Coupon Information */}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800">
                    You can only edit coupons belonging
                    to your store. The vendor ownership
                    is controlled by the backend.
                </p>
            </div>

            {/* Form */}

            <CouponForm
                initialValues={coupon}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
};

export default EditCoupon;