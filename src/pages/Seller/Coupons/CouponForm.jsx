// src/pages/Seller/Coupons/CouponForm.jsx

import { useEffect, useState } from "react";

const getInitialFormData = (initialValues = null) => ({
    code: initialValues?.code || "",
    type: initialValues?.type || "percentage",

    value:
        initialValues?.value !== null &&
        initialValues?.value !== undefined
            ? initialValues.value
            : "",

    min_order_amount:
        initialValues?.min_order_amount !== null &&
        initialValues?.min_order_amount !== undefined
            ? initialValues.min_order_amount
            : "",

    max_discount:
        initialValues?.max_discount !== null &&
        initialValues?.max_discount !== undefined
            ? initialValues.max_discount
            : "",

    usage_limit:
        initialValues?.usage_limit !== null &&
        initialValues?.usage_limit !== undefined
            ? initialValues.usage_limit
            : "",

    start_date: initialValues?.start_date
        ? String(initialValues.start_date).substring(0, 10)
        : "",

    end_date: initialValues?.end_date
        ? String(initialValues.end_date).substring(0, 10)
        : "",

    status:
        initialValues?.status === 1 ||
        initialValues?.status === true,
});

const CouponForm = ({
    initialValues = null,
    onSubmit,
    loading = false,
}) => {
    const [formData, setFormData] = useState(
        getInitialFormData(initialValues)
    );

    const [errors, setErrors] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Load Initial Values
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (initialValues) {
            setFormData(
                getInitialFormData(initialValues)
            );

            setErrors({});
        }
    }, [initialValues]);

    /*
    |--------------------------------------------------------------------------
    | Change Handler
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        // Remove field error when user changes it
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const validate = () => {
        const temp = {};

        const code = formData.code.trim();
        const value = Number(formData.value);

        const minOrderAmount =
            formData.min_order_amount === ""
                ? null
                : Number(formData.min_order_amount);

        const maxDiscount =
            formData.max_discount === ""
                ? null
                : Number(formData.max_discount);

        const usageLimit =
            formData.usage_limit === ""
                ? null
                : Number(formData.usage_limit);

        /*
        |--------------------------------------------------------------------------
        | Coupon Code
        |--------------------------------------------------------------------------
        */

        if (!code) {
            temp.code =
                "Coupon code is required.";
        } else if (code.length < 3) {
            temp.code =
                "Coupon code must be at least 3 characters.";
        }

        /*
        |--------------------------------------------------------------------------
        | Discount Value
        |--------------------------------------------------------------------------
        */

        if (formData.value === "") {
            temp.value =
                "Discount value is required.";
        } else if (
            !Number.isFinite(value) ||
            value <= 0
        ) {
            temp.value =
                "Discount value must be greater than 0.";
        } else if (
            formData.type === "percentage" &&
            value > 100
        ) {
            temp.value =
                "Percentage discount cannot exceed 100%.";
        }

        /*
        |--------------------------------------------------------------------------
        | Minimum Order Amount
        |--------------------------------------------------------------------------
        */

        if (
            minOrderAmount !== null &&
            (!Number.isFinite(minOrderAmount) ||
                minOrderAmount < 0)
        ) {
            temp.min_order_amount =
                "Minimum order amount cannot be negative.";
        }

        /*
        |--------------------------------------------------------------------------
        | Maximum Discount
        |--------------------------------------------------------------------------
        */

        if (
            formData.type === "percentage" &&
            maxDiscount !== null &&
            (!Number.isFinite(maxDiscount) ||
                maxDiscount < 0)
        ) {
            temp.max_discount =
                "Maximum discount cannot be negative.";
        }

        /*
        |--------------------------------------------------------------------------
        | Fixed Coupon
        |--------------------------------------------------------------------------
        |
        | Fixed coupons do not use max_discount.
        |
        */

        /*
        |--------------------------------------------------------------------------
        | Usage Limit
        |--------------------------------------------------------------------------
        */

        if (
            usageLimit !== null &&
            (!Number.isInteger(usageLimit) ||
                usageLimit < 1)
        ) {
            temp.usage_limit =
                "Usage limit must be a positive whole number.";
        }

        /*
        |--------------------------------------------------------------------------
        | Dates
        |--------------------------------------------------------------------------
        */

        if (!formData.start_date) {
            temp.start_date =
                "Start date is required.";
        }

        if (!formData.end_date) {
            temp.end_date =
                "End date is required.";
        }

        if (
            formData.start_date &&
            formData.end_date &&
            formData.end_date <
                formData.start_date
        ) {
            temp.end_date =
                "End date cannot be before start date.";
        }

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            code: formData.code
                .trim()
                .toUpperCase(),

            type: formData.type,

            value: Number(formData.value),

            min_order_amount:
                formData.min_order_amount === ""
                    ? null
                    : Number(
                          formData.min_order_amount
                      ),

            /*
            |--------------------------------------------------------------------------
            | Percentage coupons can have max_discount.
            | Fixed coupons send null.
            |--------------------------------------------------------------------------
            */

            max_discount:
                formData.type === "percentage" &&
                formData.max_discount !== ""
                    ? Number(
                          formData.max_discount
                      )
                    : null,

            usage_limit:
                formData.usage_limit === ""
                    ? null
                    : Number(
                          formData.usage_limit
                      ),

            start_date: formData.start_date,

            end_date: formData.end_date,

            status: Boolean(formData.status),
        };

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | We intentionally do NOT send:
        |
        | vendor_id
        | admin_coupon_scope
        |
        | Backend gets vendor_id from authenticated seller.
        |
        */

        onSubmit(payload);
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-6"
        >
            {/* Store Coupon Notice */}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Store Coupon:</strong>{" "}
                    This coupon will belong to your
                    store. The system automatically
                    associates it with your vendor
                    account.
                </p>
            </div>

            {/* Coupon Code */}

            <div>
                <label className="block mb-2 font-medium">
                    Coupon Code
                </label>

                <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="SAVE20"
                    maxLength={50}
                    disabled={loading}
                />

                {errors.code && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.code}
                    </p>
                )}
            </div>

            {/* Type & Value */}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Type */}

                <div>
                    <label className="block mb-2 font-medium">
                        Discount Type
                    </label>

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    >
                        <option value="percentage">
                            Percentage
                        </option>

                        <option value="fixed">
                            Fixed Amount
                        </option>
                    </select>
                </div>

                {/* Value */}

                <div>
                    <label className="block mb-2 font-medium">
                        Discount Value
                    </label>

                    <div className="relative">
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={
                                formData.type ===
                                "percentage"
                                    ? "20"
                                    : "500"
                            }
                            disabled={loading}
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            {formData.type ===
                            "percentage"
                                ? "%"
                                : "PKR"}
                        </span>
                    </div>

                    {errors.value && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.value}
                        </p>
                    )}
                </div>
            </div>

            {/* Minimum Order & Maximum Discount */}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Minimum Order */}

                <div>
                    <label className="block mb-2 font-medium">
                        Minimum Order Amount
                    </label>

                    <input
                        type="number"
                        name="min_order_amount"
                        value={
                            formData.min_order_amount
                        }
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Leave empty for no minimum"
                        disabled={loading}
                    />

                    {errors.min_order_amount && (
                        <p className="text-red-500 text-sm mt-1">
                            {
                                errors.min_order_amount
                            }
                        </p>
                    )}

                    <p className="text-gray-500 text-xs mt-1">
                        Customer must reach this amount
                        in eligible products.
                    </p>
                </div>

                {/* Maximum Discount */}

                <div>
                    <label className="block mb-2 font-medium">
                        Maximum Discount
                    </label>

                    <input
                        type="number"
                        name="max_discount"
                        value={
                            formData.max_discount
                        }
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        disabled={
                            loading ||
                            formData.type === "fixed"
                        }
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none ${
                            formData.type ===
                            "fixed"
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                        }`}
                        placeholder={
                            formData.type ===
                            "fixed"
                                ? "Not applicable"
                                : "Leave empty for unlimited"
                        }
                    />

                    {errors.max_discount && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.max_discount}
                        </p>
                    )}

                    {formData.type ===
                        "fixed" && (
                        <p className="text-gray-500 text-xs mt-1">
                            Maximum discount is only
                            applicable to percentage
                            coupons.
                        </p>
                    )}
                </div>
            </div>

            {/* Usage */}

            <div>
                <label className="block mb-2 font-medium">
                    Usage Limit
                </label>

                <input
                    type="number"
                    name="usage_limit"
                    value={formData.usage_limit}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Leave empty for unlimited"
                    disabled={loading}
                />

                {errors.usage_limit && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.usage_limit}
                    </p>
                )}
            </div>

            {/* Dates */}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Start Date */}

                <div>
                    <label className="block mb-2 font-medium">
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    />

                    {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.start_date}
                        </p>
                    )}
                </div>

                {/* End Date */}

                <div>
                    <label className="block mb-2 font-medium">
                        End Date
                    </label>

                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    />

                    {errors.end_date && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.end_date}
                        </p>
                    )}
                </div>
            </div>

            {/* Status */}

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="w-5 h-5"
                    disabled={loading}
                />

                <div>
                    <label className="font-medium">
                        Active Coupon
                    </label>

                    <p className="text-xs text-gray-500">
                        Inactive coupons cannot be
                        applied by customers.
                    </p>
                </div>
            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Saving..."
                        : initialValues
                        ? "Update Coupon"
                        : "Create Coupon"}
                </button>
            </div>
        </form>
    );
};

export default CouponForm;