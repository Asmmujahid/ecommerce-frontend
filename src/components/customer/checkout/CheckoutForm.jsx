// src/components/customer/checkout/CheckoutForm.jsx

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    CheckCircleOutline,
    Close,
    LocationOnOutlined,
    LocalOfferOutlined,
    ShoppingCartCheckout,
} from "@mui/icons-material";

// =====================================================
// CHECKOUT REDUX
// =====================================================

import {
    placeOrder,
    selectCheckoutLoading,
    selectCheckoutError,
    selectCheckoutValidationErrors,
} from "../../../redux/customer/checkoutSlice";

// =====================================================
// ADDRESS REDUX
// =====================================================

import {
    fetchAddresses,
    selectAddresses,
    selectAddressLoading,
} from "../../../redux/customer/addressSlice";

// =====================================================
// CART REDUX
// =====================================================

import {
    selectCartItems,
} from "../../../redux/customer/cartSlice";

// =====================================================
// COUPON REDUX
// =====================================================

import {
    fetchCoupons,
    validateCoupon,
    applyCoupon,
    clearCoupon,
    clearCouponError,

    selectCoupons,
    selectCouponLoading,
    selectCouponApplying,
    selectCouponError,
    selectCouponApplyError,

    selectAppliedCoupon,
    selectCouponDiscount,
    selectCouponEligibleProductIds,
    selectCouponEligibleSubtotal,
} from "../../../redux/customer/couponSlice";

// =====================================================
// PAYMENT
// =====================================================

import PaymentMethod from "../payment/PaymentMethod";

import BankTransferForm from "../payment/BankTransferForm";

import CardPaymentForm from "../payment/CardPaymentForm";

// =====================================================
// HELPERS
// =====================================================

const normalizeId = (value) => {
    const id = Number(value);

    return Number.isInteger(id) && id > 0
        ? id
        : null;
};

// =====================================================
// PRODUCT ID
// =====================================================

const getItemProductId = (item) => {
    const possibleId =
        item?.product_id ??
        item?.product?.id ??
        item?.product?.product_id ??
        item?.variant?.product_id;

    return normalizeId(
        possibleId
    );
};

// =====================================================
// QUANTITY
// =====================================================

const getItemQuantity = (item) => {
    const quantity = Number(
        item?.quantity ??
        item?.qty ??
        1
    );

    if (
        !Number.isFinite(
            quantity
        ) ||
        quantity <= 0
    ) {
        return 0;
    }

    return quantity;
};

// =====================================================
// PRICE
// =====================================================

const getItemPrice = (item) => {
    const product =
        item?.product || {};

    const variant =
        item?.variant || {};

    const possiblePrice =
        item?.price ??
        item?.unit_price ??
        item?.product_price ??
        item?.discount_price ??
        variant?.discount_price ??
        variant?.price ??
        product?.discount_price ??
        product?.price ??
        0;

    const price =
        Number(
            possiblePrice
        );

    if (
        !Number.isFinite(price) ||
        price < 0
    ) {
        return 0;
    }

    return price;
};

// =====================================================
// ITEM AMOUNT
// =====================================================

const getItemAmount = (item) => {
    return (
        getItemPrice(item) *
        getItemQuantity(item)
    );
};

// =====================================================
// CLEAN PRODUCT IDS
// =====================================================

const cleanProductIds = (
    productIds = []
) => {
    if (
        !Array.isArray(
            productIds
        )
    ) {
        return [];
    }

    return [
        ...new Set(
            productIds
                .map(normalizeId)
                .filter(Boolean)
        ),
    ];
};

// =====================================================
// BUILD COUPON ITEMS
// =====================================================

const buildCouponItems = (
    cartItems = []
) => {
    if (
        !Array.isArray(
            cartItems
        )
    ) {
        return [];
    }

    const itemMap =
        new Map();

    cartItems.forEach(
        (item) => {
            const productId =
                getItemProductId(
                    item
                );

            const quantity =
                getItemQuantity(
                    item
                );

            if (
                !productId ||
                quantity <= 0
            ) {
                return;
            }

            const previousQuantity =
                itemMap.get(
                    productId
                ) || 0;

            itemMap.set(
                productId,
                previousQuantity +
                    quantity
            );
        }
    );

    return Array.from(
        itemMap.entries()
    ).map(
        ([
            productId,
            quantity,
        ]) => ({
            product_id:
                productId,

            quantity,
        })
    );
};

// =====================================================
// COUPON CODE
// =====================================================

const getCouponCode = (
    coupon
) => {
    return String(
        coupon?.coupon_code ??
        coupon?.code ??
        coupon?.coupon?.code ??
        ""
    )
        .trim()
        .toUpperCase();
};

// =====================================================
// COUPON ID
// =====================================================

const getCouponId = (
    coupon
) => {
    const id =
        coupon?.coupon_id ??
        coupon?.id ??
        coupon?.coupon?.id;

    const numericId =
        Number(id);

    return Number.isInteger(
        numericId
    ) &&
        numericId > 0
        ? numericId
        : null;
};

// =====================================================
// FORMAT PRICE
// =====================================================

const formatPrice = (
    amount
) => {
    const value =
        Number(amount);

    if (
        !Number.isFinite(
            value
        )
    ) {
        return "0.00";
    }

    return value.toLocaleString(
        "en-PK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
};

// =====================================================
// FORMAT ADDRESS
// =====================================================

const formatAddress = (
    address
) => {
    if (!address) {
        return "";
    }

    if (
        typeof address ===
        "string"
    ) {
        return address;
    }

    const parts = [
        address.full_name,
        address.name,
        address.address_line_1,
        address.address_line_2,
        address.address_line2,
        address.street,
        address.area,
        address.city,
        address.state,
        address.province,
        address.postal_code,
        address.zip_code,
        address.country,
        address.phone,
    ].filter(
        (value) =>
            value !== null &&
            value !== undefined &&
            String(
                value
            ).trim() !== ""
    );

    return parts.join(
        ", "
    );
};

// =====================================================
// COMPONENT
// =====================================================

const CheckoutForm = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    // =====================================================
    // CHECKOUT
    // =====================================================

    const checkoutLoading =
        useSelector(
            selectCheckoutLoading
        );

    const checkoutError =
        useSelector(
            selectCheckoutError
        );

    const validationErrors =
        useSelector(
            selectCheckoutValidationErrors
        );

    // =====================================================
    // ADDRESS
    // =====================================================

    const addresses =
        useSelector(
            selectAddresses
        );

    const addressLoading =
        useSelector(
            selectAddressLoading
        );

    // =====================================================
    // CART
    // =====================================================

    const cartItems =
        useSelector(
            selectCartItems
        );

    // =====================================================
    // COUPON
    // =====================================================

    const coupons =
        useSelector(
            selectCoupons
        );

    const couponLoading =
        useSelector(
            selectCouponLoading
        );

    const couponApplying =
        useSelector(
            selectCouponApplying
        );

    const couponError =
        useSelector(
            selectCouponError
        );

    const couponApplyError =
        useSelector(
            selectCouponApplyError
        );

    const appliedCoupon =
        useSelector(
            selectAppliedCoupon
        );

    const couponDiscount =
        useSelector(
            selectCouponDiscount
        );

    const eligibleProductIds =
        useSelector(
            selectCouponEligibleProductIds
        );

    const eligibleSubtotalFromServer =
        useSelector(
            selectCouponEligibleSubtotal
        );

    // =====================================================
    // DISPLAYED COUPON ERROR
    // =====================================================

    const displayedCouponError =
        couponApplyError ||
        couponError;

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        shippingAddress,
        setShippingAddress,
    ] = useState("");

    const [
        selectedAddressId,
        setSelectedAddressId,
    ] = useState("");

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState("cod");

    const [
        transactionId,
        setTransactionId,
    ] = useState("");

    const [
        selectedCouponCode,
        setSelectedCouponCode,
    ] = useState("");

    const [
        couponMessage,
        setCouponMessage,
    ] = useState("");

    const [
        removedCouponCodes,
        setRemovedCouponCodes,
    ] = useState([]);

    // =====================================================
    // APPLY LOCK
    // =====================================================

    const couponApplyLock =
        useRef(false);

    const [
        isApplyingCoupon,
        setIsApplyingCoupon,
    ] = useState(false);

    // =====================================================
    // CART TRACKING
    // =====================================================

    const previousCartSignature =
        useRef(null);

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeCartItems =
        Array.isArray(
            cartItems
        )
            ? cartItems
            : [];

    const safeAddresses =
        Array.isArray(
            addresses
        )
            ? addresses
            : [];

    const safeCoupons =
        Array.isArray(
            coupons
        )
            ? coupons
            : [];

    const safeEligibleProductIds =
        cleanProductIds(
            eligibleProductIds
        );

    // =====================================================
    // CART PRODUCT IDS
    // =====================================================

    const cartProductIds =
        useMemo(
            () => {
                return cleanProductIds(
                    safeCartItems.map(
                        getItemProductId
                    )
                );
            },
            [safeCartItems]
        );

    const cartProductIdsKey =
        cartProductIds.join(
            ","
        );

    // =====================================================
    // COUPON ITEMS
    // =====================================================

    const couponItems =
        useMemo(
            () => {
                return buildCouponItems(
                    safeCartItems
                );
            },
            [safeCartItems]
        );

    // =====================================================
    // CART SIGNATURE
    // =====================================================

    const cartSignature =
        useMemo(
            () => {
                return JSON.stringify(
                    couponItems
                        .slice()
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                a.product_id -
                                b.product_id
                        )
                );
            },
            [couponItems]
        );

    // =====================================================
    // ORIGINAL SUBTOTAL
    // =====================================================

    /*
     * THIS IS ALWAYS THE ORIGINAL
     * CART SUBTOTAL.
     *
     * COUPON NEVER CHANGES THIS VALUE.
     */

    const subtotal =
        useMemo(
            () => {
                const amount =
                    safeCartItems.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            getItemAmount(
                                item
                            ),
                        0
                    );

                return Number(
                    amount.toFixed(
                        2
                    )
                );
            },
            [safeCartItems]
        );

    // =====================================================
    // APPLIED COUPON CODE
    // =====================================================

    const appliedCouponCode =
        useMemo(
            () => {
                return getCouponCode(
                    appliedCoupon
                );
            },
            [appliedCoupon]
        );

    // =====================================================
    // APPLIED COUPON ID
    // =====================================================

    const appliedCouponId =
        useMemo(
            () => {
                return getCouponId(
                    appliedCoupon
                );
            },
            [appliedCoupon]
        );

    // =====================================================
    // HAS APPLIED COUPON
    // =====================================================

    const hasAppliedCoupon =
        Boolean(
            appliedCoupon &&
            appliedCouponCode
        );

    // =====================================================
    // DISCOUNT
    // =====================================================

    const discount =
        useMemo(
            () => {
                if (
                    !hasAppliedCoupon
                ) {
                    return 0;
                }

                const serverDiscount =
                    Number(
                        couponDiscount
                    );

                if (
                    !Number.isFinite(
                        serverDiscount
                    ) ||
                    serverDiscount <= 0
                ) {
                    return 0;
                }

                /*
                 * NEVER allow discount
                 * greater than original subtotal.
                 */

                return Number(
                    Math.min(
                        serverDiscount,
                        subtotal
                    ).toFixed(
                        2
                    )
                );
            },
            [
                hasAppliedCoupon,
                couponDiscount,
                subtotal,
            ]
        );

    // =====================================================
    // FINAL TOTAL
    // =====================================================

    const finalTotal =
        useMemo(
            () => {
                /*
                 * NO COUPON
                 */

                if (
                    !hasAppliedCoupon
                ) {
                    return Number(
                        subtotal.toFixed(
                            2
                        )
                    );
                }

                /*
                 * IMPORTANT:
                 *
                 * Always:
                 *
                 * ORIGINAL SUBTOTAL
                 * - CURRENT COUPON
                 *
                 * Never previousTotal - discount.
                 */

                return Number(
                    Math.max(
                        0,
                        subtotal -
                            discount
                    ).toFixed(
                        2
                    )
                );
            },
            [
                subtotal,
                discount,
                hasAppliedCoupon,
            ]
        );

    // =====================================================
    // FETCH ADDRESSES
    // =====================================================

    useEffect(() => {
        dispatch(
            fetchAddresses()
        );
    }, [dispatch]);

    // =====================================================
    // FETCH COUPONS
    // =====================================================

    useEffect(() => {
        if (
            cartProductIds.length ===
            0
        ) {
            return;
        }

        dispatch(
            fetchCoupons(
                cartProductIds
            )
        );
    }, [
        dispatch,
        cartProductIdsKey,
    ]);

    // =====================================================
    // CART CHANGE
    // =====================================================

    useEffect(() => {
        if (
            previousCartSignature.current ===
            null
        ) {
            previousCartSignature.current =
                cartSignature;

            return;
        }

        if (
            previousCartSignature.current ===
            cartSignature
        ) {
            return;
        }

        previousCartSignature.current =
            cartSignature;

        /*
         * Cart changed.
         *
         * Remove coupon because its
         * eligibility may have changed.
         */

        if (
            hasAppliedCoupon
        ) {
            dispatch(
                clearCoupon()
            );

            dispatch(
                clearCouponError()
            );

            setSelectedCouponCode(
                ""
            );

            setCouponMessage(
                "Your cart changed, so the coupon was removed. Please apply it again."
            );
        } else {
            setSelectedCouponCode(
                ""
            );

            setCouponMessage(
                ""
            );
        }

        setRemovedCouponCodes(
            []
        );

        couponApplyLock.current =
            false;

        setIsApplyingCoupon(
            false
        );
    }, [
        cartSignature,
        hasAppliedCoupon,
        dispatch,
    ]);

    // =====================================================
    // DEFAULT ADDRESS
    // =====================================================

    useEffect(() => {
        if (
            safeAddresses.length ===
            0
        ) {
            setSelectedAddressId(
                ""
            );

            setShippingAddress(
                ""
            );

            return;
        }

        const defaultAddress =
            safeAddresses.find(
                (
                    address
                ) =>
                    address?.is_default ===
                        true ||
                    address?.is_default ===
                        1 ||
                    address?.is_default ===
                        "1"
            );

        const addressToUse =
            defaultAddress ||
            safeAddresses[0];

        if (
            addressToUse?.id !==
            undefined
        ) {
            setSelectedAddressId(
                String(
                    addressToUse.id
                )
            );
        }

        setShippingAddress(
            formatAddress(
                addressToUse
            )
        );
    }, [safeAddresses]);

    // =====================================================
    // ADDRESS CHANGE
    // =====================================================

    const handleAddressChange =
        (event) => {
            const id =
                event.target.value;

            setSelectedAddressId(
                id
            );

            const selectedAddress =
                safeAddresses.find(
                    (
                        address
                    ) =>
                        String(
                            address?.id
                        ) ===
                        String(id)
                );

            if (
                selectedAddress
            ) {
                setShippingAddress(
                    formatAddress(
                        selectedAddress
                    )
                );
            }
        };

    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    const handlePaymentMethodChange =
        (method) => {
            setPaymentMethod(
                method
            );

            if (
                method !==
                "bank_transfer"
            ) {
                setTransactionId(
                    ""
                );
            }
        };

    // =====================================================
    // FIELD ERROR
    // =====================================================

    const getFieldError =
        (field) => {
            const fieldErrors =
                validationErrors?.[
                    field
                ];

            if (
                Array.isArray(
                    fieldErrors
                ) &&
                fieldErrors.length >
                    0
            ) {
                return fieldErrors[0];
            }

            if (
                typeof fieldErrors ===
                "string"
            ) {
                return fieldErrors;
            }

            return "";
        };

    // =====================================================
    // COUPON EXPIRED
    // =====================================================

    const isCouponExpired =
        (coupon) => {
            if (!coupon) {
                return false;
            }

            const endDateValue =
                coupon?.end_date ??
                coupon?.expires_at;

            if (
                !endDateValue
            ) {
                return false;
            }

            const dateOnly =
                String(
                    endDateValue
                ).slice(
                    0,
                    10
                );

            if (
                /^\d{4}-\d{2}-\d{2}$/.test(
                    dateOnly
                )
            ) {
                const today =
                    new Date();

                const todayString =
                    `${today.getFullYear()}-${String(
                        today.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    )}-${String(
                        today.getDate()
                    ).padStart(
                        2,
                        "0"
                    )}`;

                return (
                    todayString >
                    dateOnly
                );
            }

            const endDate =
                new Date(
                    endDateValue
                );

            if (
                Number.isNaN(
                    endDate.getTime()
                )
            ) {
                return false;
            }

            return (
                Date.now() >
                endDate.getTime()
            );
        };

    // =====================================================
    // COUPON NOT STARTED
    // =====================================================

    const isCouponNotStarted =
        (coupon) => {
            if (!coupon) {
                return false;
            }

            const startDateValue =
                coupon?.start_date;

            if (
                !startDateValue
            ) {
                return false;
            }

            const dateOnly =
                String(
                    startDateValue
                ).slice(
                    0,
                    10
                );

            if (
                /^\d{4}-\d{2}-\d{2}$/.test(
                    dateOnly
                )
            ) {
                const today =
                    new Date();

                const todayString =
                    `${today.getFullYear()}-${String(
                        today.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    )}-${String(
                        today.getDate()
                    ).padStart(
                        2,
                        "0"
                    )}`;

                return (
                    todayString <
                    dateOnly
                );
            }

            const startDate =
                new Date(
                    startDateValue
                );

            if (
                Number.isNaN(
                    startDate.getTime()
                )
            ) {
                return false;
            }

            return (
                Date.now() <
                startDate.getTime()
            );
        };

    // =====================================================
    // COUPON USABLE
    // =====================================================

    const isCouponUsable =
        (coupon) => {
            if (!coupon) {
                return false;
            }

            if (
                coupon?.status ===
                    false ||
                coupon?.status ===
                    0 ||
                coupon?.status ===
                    "0"
            ) {
                return false;
            }

            if (
                isCouponExpired(
                    coupon
                )
            ) {
                return false;
            }

            if (
                isCouponNotStarted(
                    coupon
                )
            ) {
                return false;
            }

            const usageLimit =
                coupon?.usage_limit;

            const usedCount =
                Number(
                    coupon?.used_count ??
                        0
                );

            if (
                usageLimit !==
                    null &&
                usageLimit !==
                    undefined &&
                Number(
                    usageLimit
                ) > 0 &&
                usedCount >=
                    Number(
                        usageLimit
                    )
            ) {
                return false;
            }

            return true;
        };

    // =====================================================
    // EXPIRED COUPONS
    // =====================================================

    const expiredCoupons =
        useMemo(
            () => {
                return safeCoupons.filter(
                    (
                        coupon
                    ) =>
                        isCouponExpired(
                            coupon
                        )
                );
            },
            [safeCoupons]
        );

    // =====================================================
    // AVAILABLE COUPONS
    // =====================================================

    const availableCoupons =
        useMemo(
            () => {
                return safeCoupons.filter(
                    (
                        coupon
                    ) => {
                        const code =
                            getCouponCode(
                                coupon
                            );

                        if (
                            removedCouponCodes.includes(
                                code
                            )
                        ) {
                            return false;
                        }

                        return isCouponUsable(
                            coupon
                        );
                    }
                );
            },
            [
                safeCoupons,
                removedCouponCodes,
            ]
        );

    // =====================================================
    // SELECT COUPON
    // =====================================================

    const handleSelectCoupon =
        (coupon) => {
            if (!coupon) {
                return;
            }

            /*
             * ONE COUPON ONLY
             */

            if (
                hasAppliedCoupon
            ) {
                setCouponMessage(
                    `Coupon ${appliedCouponCode} is already applied. Remove it before applying another coupon.`
                );

                return;
            }

            if (
                !isCouponUsable(
                    coupon
                )
            ) {
                setCouponMessage(
                    "This coupon is not currently usable."
                );

                return;
            }

            const code =
                getCouponCode(
                    coupon
                );

            if (!code) {
                setCouponMessage(
                    "Invalid coupon code."
                );

                return;
            }

            setSelectedCouponCode(
                code
            );

            setCouponMessage(
                `Coupon ${code} selected. Click Apply.`
            );

            dispatch(
                clearCouponError()
            );
        };

    // =====================================================
    // DISMISS COUPON
    // =====================================================

    const handleDismissCoupon =
        (coupon) => {
            const code =
                getCouponCode(
                    coupon
                );

            if (!code) {
                return;
            }

            setRemovedCouponCodes(
                (previous) => {
                    if (
                        previous.includes(
                            code
                        )
                    ) {
                        return previous;
                    }

                    return [
                        ...previous,
                        code,
                    ];
                }
            );

            if (
                selectedCouponCode
                    .trim()
                    .toUpperCase() ===
                code
            ) {
                setSelectedCouponCode(
                    ""
                );

                setCouponMessage(
                    ""
                );
            }
        };

    // =====================================================
    // APPLY COUPON
    // =====================================================

    const handleApplyCoupon =
        async () => {
            /*
             * Prevent duplicate requests.
             */

            if (
                couponApplyLock.current ||
                isApplyingCoupon
            ) {
                return;
            }

            /*
             * ONE COUPON ONLY
             */

            if (
                hasAppliedCoupon
            ) {
                setCouponMessage(
                    `Coupon ${appliedCouponCode} is already applied. Remove it before applying another coupon.`
                );

                return;
            }

            const code =
                selectedCouponCode
                    .trim()
                    .toUpperCase();

            if (!code) {
                setCouponMessage(
                    "Please select or enter a coupon code."
                );

                return;
            }

            if (
                subtotal <= 0
            ) {
                setCouponMessage(
                    "Your cart amount must be greater than zero."
                );

                return;
            }

            if (
                cartProductIds.length ===
                0
            ) {
                setCouponMessage(
                    "No valid products were found in your cart."
                );

                return;
            }

            if (
                couponItems.length ===
                0
            ) {
                setCouponMessage(
                    "No valid cart items were found."
                );

                return;
            }

            /*
             * LOCK
             */

            couponApplyLock.current =
                true;

            setIsApplyingCoupon(
                true
            );

            setCouponMessage(
                ""
            );

            dispatch(
                clearCouponError()
            );

            try {
                // =============================================
                // VALIDATE
                // =============================================

                const validationResult =
                    await dispatch(
                        validateCoupon(
                            {
                                code,

                                product_ids:
                                    cartProductIds,
                            }
                        )
                    );

                if (
                    !validateCoupon.fulfilled.match(
                        validationResult
                    )
                ) {
                    const errorMessage =
                        validationResult?.payload ||
                        validationResult
                            ?.error
                            ?.message ||
                        "Coupon validation failed.";

                    setCouponMessage(
                        String(
                            errorMessage
                        )
                    );

                    return;
                }

                // =============================================
                // APPLY
                // =============================================

                const applyResult =
                    await dispatch(
                        applyCoupon(
                            {
                                code,

                                product_ids:
                                    cartProductIds,

                                items:
                                    couponItems,
                            }
                        )
                    );

                if (
                    !applyCoupon.fulfilled.match(
                        applyResult
                    )
                ) {
                    const errorMessage =
                        applyResult?.payload ||
                        applyResult
                            ?.error
                            ?.message ||
                        "Coupon could not be applied.";

                    setCouponMessage(
                        String(
                            errorMessage
                        )
                    );

                    return;
                }

                // =============================================
                // SUCCESS
                // =============================================

                setSelectedCouponCode(
                    code
                );

                setCouponMessage(
                    `Coupon ${code} applied successfully.`
                );
            } catch (error) {
                console.error(
                    "COUPON APPLY ERROR:",
                    error
                );

                setCouponMessage(
                    error?.message ||
                    "Unable to apply coupon."
                );
            } finally {
                couponApplyLock.current =
                    false;

                setIsApplyingCoupon(
                    false
                );
            }
        };

    // =====================================================
    // REMOVE COUPON
    // =====================================================

    const handleRemoveCoupon =
        () => {
            /*
             * IMPORTANT:
             *
             * clearCoupon ONLY clears coupon
             * Redux state.
             *
             * It does NOT modify cart.
             *
             * Therefore subtotal automatically
             * returns/remains at ORIGINAL amount.
             */

            dispatch(
                clearCoupon()
            );

            dispatch(
                clearCouponError()
            );

            setSelectedCouponCode(
                ""
            );

            setCouponMessage(
                "Coupon removed. You can now select another coupon."
            );

            couponApplyLock.current =
                false;

            setIsApplyingCoupon(
                false
            );
        };

    // =====================================================
    // AUTO REMOVE EXPIRED APPLIED COUPON
    // =====================================================

    useEffect(() => {
        if (
            !appliedCoupon
        ) {
            return;
        }

        const code =
            getCouponCode(
                appliedCoupon
            );

        if (!code) {
            return;
        }

        const couponFromList =
            safeCoupons.find(
                (
                    coupon
                ) =>
                    getCouponCode(
                        coupon
                    ) === code
            );

        if (
            couponFromList &&
            isCouponExpired(
                couponFromList
            )
        ) {
            dispatch(
                clearCoupon()
            );

            dispatch(
                clearCouponError()
            );

            setSelectedCouponCode(
                ""
            );

            setCouponMessage(
                "The applied coupon has expired and was removed."
            );
        }
    }, [
        appliedCoupon,
        safeCoupons,
        dispatch,
    ]);

    // =====================================================
    // SUBMIT CHECKOUT
    // =====================================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            if (
                !shippingAddress.trim()
            ) {
                return;
            }

            if (!paymentMethod) {
                return;
            }

            if (
                paymentMethod ===
                    "bank_transfer" &&
                !transactionId.trim()
            ) {
                return;
            }

            if (
                subtotal <= 0
            ) {
                return;
            }

            // =============================================
            // ORIGINAL CHECKOUT DATA
            // =============================================

            const checkoutData = {
                payment_method:
                    paymentMethod,

                shipping_address:
                    shippingAddress.trim(),

                /*
                 * ALWAYS ORIGINAL SUBTOTAL.
                 *
                 * Example:
                 *
                 * Original = 10,000
                 * Coupon = 1,000
                 * Final = 9,000
                 *
                 * Backend receives:
                 *
                 * subtotal_amount = 10,000
                 */

                subtotal_amount:
                    Number(
                        subtotal.toFixed(
                            2
                        )
                    ),
            };

            // =============================================
            // CURRENT COUPON ONLY
            // =============================================

            if (
                hasAppliedCoupon
            ) {
                if (
                    appliedCouponId
                ) {
                    checkoutData.coupon_id =
                        appliedCouponId;
                }

                checkoutData.coupon_code =
                    appliedCouponCode;
            }

            // =============================================
            // BANK TRANSFER
            // =============================================

            if (
                paymentMethod ===
                "bank_transfer"
            ) {
                checkoutData.transaction_id =
                    transactionId.trim();
            }

            // =============================================
            // DEBUG
            // =============================================

            console.log(
                "========== CHECKOUT =========="
            );

            console.log(
                "ORIGINAL SUBTOTAL:",
                subtotal
            );

            console.log(
                "APPLIED COUPON:",
                appliedCoupon
            );

            console.log(
                "COUPON ID:",
                appliedCouponId
            );

            console.log(
                "COUPON CODE:",
                appliedCouponCode
            );

            console.log(
                "DISCOUNT:",
                discount
            );

            console.log(
                "FINAL TOTAL:",
                finalTotal
            );

            console.log(
                "CHECKOUT DATA:",
                checkoutData
            );

            console.log(
                "=============================="
            );

            // =============================================
            // PLACE ORDER
            // =============================================

            const result =
                await dispatch(
                    placeOrder(
                        checkoutData
                    )
                );

            // =============================================
            // SUCCESS
            // =============================================

            if (
                placeOrder.fulfilled.match(
                    result
                )
            ) {
                const responseData =
                    result.payload
                        ?.data;

                const payment =
                    responseData
                        ?.payment;

                const order =
                    responseData
                        ?.order;

                console.log(
                    "ORDER RESPONSE:",
                    result.payload
                );

                console.log(
                    "BACKEND ORDER:",
                    order
                );

                console.log(
                    "BACKEND SUBTOTAL:",
                    order?.subtotal_amount
                );

                console.log(
                    "BACKEND DISCOUNT:",
                    order?.discount_amount
                );

                console.log(
                    "BACKEND TOTAL:",
                    order?.total_amount
                );

                if (
                    payment?.id
                ) {
                    navigate(
                        `/customer/payments/${payment.id}`,
                        {
                            replace: true,

                            state: {
                                payment,
                                order,
                            },
                        }
                    );

                    return;
                }

                if (
                    order?.id
                ) {
                    navigate(
                        `/customer/orders/${order.id}`,
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                console.error(
                    "Order created but order/payment data was not returned."
                );
            }
        };

    // =====================================================
    // FIELD ERRORS
    // =====================================================

    const shippingAddressError =
        getFieldError(
            "shipping_address"
        );

    const paymentMethodError =
        getFieldError(
            "payment_method"
        );

    const transactionIdError =
        getFieldError(
            "transaction_id"
        );

    // =====================================================
    // LOADING
    // =====================================================

    const isLoading =
        checkoutLoading ||
        addressLoading;

    const couponBusy =
        couponLoading ||
        couponApplying ||
        isApplyingCoupon;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            component="form"
            onSubmit={
                handleSubmit
            }
            sx={{
                width: "100%",
            }}
        >
            <Stack spacing={3}>

                {/* =================================================
                    CHECKOUT ERROR
                ================================================= */}

                {checkoutError && (
                    <Alert severity="error">
                        {typeof checkoutError ===
                        "string"
                            ? checkoutError
                            : checkoutError?.message ||
                              "Unable to place order."}
                    </Alert>
                )}

                {/* =================================================
                    SHIPPING ADDRESS
                ================================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                        borderRadius: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mb: 2,
                        }}
                    >
                        <LocationOnOutlined color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Shipping Address
                        </Typography>
                    </Stack>

                    {addressLoading ? (
                        <Box
                            sx={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <CircularProgress
                                size={20}
                            />

                            <Typography>
                                Loading addresses...
                            </Typography>
                        </Box>
                    ) : safeAddresses.length >
                      0 ? (
                        <TextField
                            select
                            fullWidth
                            label="Select Saved Address"
                            value={
                                selectedAddressId
                            }
                            onChange={
                                handleAddressChange
                            }
                            disabled={
                                isLoading
                            }
                            sx={{
                                mb: 2,
                            }}
                        >
                            {safeAddresses.map(
                                (
                                    address
                                ) => (
                                    <MenuItem
                                        key={
                                            address.id
                                        }
                                        value={String(
                                            address.id
                                        )}
                                    >
                                        {formatAddress(
                                            address
                                        )}
                                    </MenuItem>
                                )
                            )}
                        </TextField>
                    ) : (
                        <Alert
                            severity="info"
                            sx={{
                                mb: 2,
                            }}
                        >
                            You don't have a
                            saved address yet.
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Shipping Address"
                        placeholder="Enter your complete shipping address"
                        value={
                            shippingAddress
                        }
                        onChange={(
                            event
                        ) =>
                            setShippingAddress(
                                event.target.value
                            )
                        }
                        error={Boolean(
                            shippingAddressError
                        )}
                        helperText={
                            shippingAddressError ||
                            "Your selected saved address is loaded automatically."
                        }
                        disabled={
                            isLoading
                        }
                    />

                    <Button
                        type="button"
                        variant="text"
                        size="small"
                        onClick={() =>
                            navigate(
                                "/customer/addresses"
                            )
                        }
                        sx={{
                            mt: 1,
                            textTransform:
                                "none",
                        }}
                    >
                        Manage My Addresses
                    </Button>
                </Paper>

                {/* =================================================
                    COUPONS
                ================================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                        borderRadius: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mb: 2,
                        }}
                    >
                        <LocalOfferOutlined color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Available Coupons
                        </Typography>
                    </Stack>

                    {/* APPLIED */}

                    {hasAppliedCoupon && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 2,
                            }}
                        >
                            <strong>
                                {
                                    appliedCouponCode
                                }
                            </strong>{" "}
                            is applied.

                            {discount >
                                0 && (
                                <>
                                    {" "}
                                    You saved Rs.{" "}
                                    {formatPrice(
                                        discount
                                    )}
                                    .
                                </>
                            )}
                        </Alert>
                    )}

                    {/* ERROR */}

                    {displayedCouponError && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                            }}
                        >
                            {typeof displayedCouponError ===
                            "string"
                                ? displayedCouponError
                                : displayedCouponError?.message ||
                                  "Unable to apply coupon."}
                        </Alert>
                    )}

                    {/* LOADING */}

                    {couponLoading &&
                        safeCoupons.length ===
                            0 && (
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1,
                                    mb: 2,
                                }}
                            >
                                <CircularProgress
                                    size={20}
                                />

                                <Typography>
                                    Loading coupons...
                                </Typography>
                            </Box>
                        )}

                    {/* EXPIRED COUPONS */}

                    {!couponLoading &&
                        expiredCoupons.length >
                            0 && (
                            <Stack
                                spacing={1.5}
                                sx={{
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color="error"
                                    fontWeight={700}
                                >
                                    Expired Coupons
                                </Typography>

                                {expiredCoupons.map(
                                    (
                                        coupon
                                    ) => {
                                        const code =
                                            getCouponCode(
                                                coupon
                                            );

                                        if (
                                            removedCouponCodes.includes(
                                                code
                                            )
                                        ) {
                                            return null;
                                        }

                                        const value =
                                            Number(
                                                coupon?.value ??
                                                    0
                                            );

                                        const text =
                                            coupon?.type ===
                                            "percentage"
                                                ? `${value}% OFF`
                                                : `Rs. ${formatPrice(
                                                      value
                                                  )} OFF`;

                                        return (
                                            <Paper
                                                key={
                                                    coupon?.id ||
                                                    code
                                                }
                                                variant="outlined"
                                                sx={{
                                                    position:
                                                        "relative",
                                                    p: 2,
                                                    borderRadius:
                                                        2,
                                                    opacity:
                                                        0.75,
                                                }}
                                            >
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDismissCoupon(
                                                            coupon
                                                        )
                                                    }
                                                    sx={{
                                                        position:
                                                            "absolute",
                                                        top: 6,
                                                        right: 6,
                                                        minWidth:
                                                            32,
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius:
                                                            "50%",
                                                        p: 0,
                                                        color:
                                                            "error.main",
                                                    }}
                                                >
                                                    <Close fontSize="small" />
                                                </Button>

                                                <Typography
                                                    fontWeight={800}
                                                >
                                                    {
                                                        code
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        text
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                    fontWeight={700}
                                                >
                                                    Coupon expired
                                                </Typography>
                                            </Paper>
                                        );
                                    }
                                )}
                            </Stack>
                        )}

                    {/* AVAILABLE COUPONS */}

                    {!couponLoading &&
                        availableCoupons.length >
                            0 && (
                            <Stack
                                spacing={1.5}
                                sx={{
                                    mb: 3,
                                }}
                            >
                                {availableCoupons.map(
                                    (
                                        coupon
                                    ) => {
                                        const code =
                                            getCouponCode(
                                                coupon
                                            );

                                        const isSelected =
                                            selectedCouponCode ===
                                            code;

                                        const isApplied =
                                            appliedCouponCode ===
                                            code;

                                        const anotherCouponApplied =
                                            hasAppliedCoupon &&
                                            !isApplied;

                                        const value =
                                            Number(
                                                coupon?.value ??
                                                    0
                                            );

                                        const discountText =
                                            coupon?.type ===
                                            "percentage"
                                                ? `${value}% OFF`
                                                : `Rs. ${formatPrice(
                                                      value
                                                  )} OFF`;

                                        return (
                                            <Paper
                                                key={
                                                    coupon?.id ||
                                                    code
                                                }
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius:
                                                        2,
                                                    borderColor:
                                                        isApplied
                                                            ? "success.main"
                                                            : isSelected
                                                            ? "primary.main"
                                                            : "divider",
                                                    opacity:
                                                        anotherCouponApplied
                                                            ? 0.5
                                                            : 1,
                                                }}
                                            >
                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        sm: "row",
                                                    }}
                                                    justifyContent="space-between"
                                                    alignItems={{
                                                        xs: "stretch",
                                                        sm: "center",
                                                    }}
                                                    spacing={2}
                                                >
                                                    <Box>
                                                        <Typography
                                                            fontWeight={
                                                                800
                                                            }
                                                            color={
                                                                isApplied
                                                                    ? "success.main"
                                                                    : "primary"
                                                            }
                                                        >
                                                            {
                                                                code
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {
                                                                discountText
                                                            }
                                                        </Typography>

                                                        {coupon?.min_order_amount !==
                                                            null &&
                                                            coupon?.min_order_amount !==
                                                                undefined && (
                                                                <Typography
                                                                    variant="caption"
                                                                    display="block"
                                                                    color="text.secondary"
                                                                >
                                                                    Minimum
                                                                    eligible
                                                                    amount:
                                                                    Rs.{" "}
                                                                    {formatPrice(
                                                                        coupon.min_order_amount
                                                                    )}
                                                                </Typography>
                                                            )}

                                                        {isApplied && (
                                                            <Typography
                                                                variant="caption"
                                                                color="success.main"
                                                                fontWeight={700}
                                                                display="block"
                                                            >
                                                                ✓ Applied
                                                            </Typography>
                                                        )}

                                                        {isSelected &&
                                                            !isApplied && (
                                                                <Typography
                                                                    variant="caption"
                                                                    color="primary.main"
                                                                    fontWeight={700}
                                                                    display="block"
                                                                >
                                                                    Selected
                                                                    — click
                                                                    Apply
                                                                </Typography>
                                                            )}
                                                    </Box>

                                                    <Button
                                                        type="button"
                                                        variant={
                                                            isApplied ||
                                                            isSelected
                                                                ? "contained"
                                                                : "outlined"
                                                        }
                                                        color={
                                                            isApplied
                                                                ? "success"
                                                                : "primary"
                                                        }
                                                        onClick={() =>
                                                            handleSelectCoupon(
                                                                coupon
                                                            )
                                                        }
                                                        disabled={
                                                            couponBusy ||
                                                            checkoutLoading ||
                                                            isApplied ||
                                                            anotherCouponApplied
                                                        }
                                                        sx={{
                                                            minWidth:
                                                                125,
                                                            textTransform:
                                                                "none",
                                                            fontWeight:
                                                                700,
                                                        }}
                                                    >
                                                        {isApplied
                                                            ? "Applied"
                                                            : isSelected
                                                            ? "Selected"
                                                            : "Use Coupon"}
                                                    </Button>
                                                </Stack>
                                            </Paper>
                                        );
                                    }
                                )}
                            </Stack>
                        )}

                    {/* EMPTY */}

                    {!couponLoading &&
                        availableCoupons.length ===
                            0 &&
                        expiredCoupons.length ===
                            0 &&
                        !displayedCouponError && (
                            <Alert
                                severity="info"
                                sx={{
                                    mb: 2,
                                }}
                            >
                                No active coupons are
                                available for the
                                products in your cart.
                            </Alert>
                        )}

                    {/* MANUAL CODE */}

                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                            mb: 1,
                        }}
                    >
                        Enter coupon code manually
                    </Typography>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                    >
                        <TextField
                            fullWidth
                            label="Coupon Code"
                            placeholder="e.g. SAVE10"
                            value={
                                selectedCouponCode
                            }
                            onChange={(
                                event
                            ) =>
                                setSelectedCouponCode(
                                    event.target.value.toUpperCase()
                                )
                            }
                            disabled={
                                checkoutLoading ||
                                couponBusy ||
                                hasAppliedCoupon
                            }
                        />

                        {!hasAppliedCoupon ? (
                            <Button
                                type="button"
                                variant="contained"
                                onClick={
                                    handleApplyCoupon
                                }
                                disabled={
                                    checkoutLoading ||
                                    couponBusy ||
                                    !selectedCouponCode.trim() ||
                                    subtotal <=
                                        0 ||
                                    cartProductIds.length ===
                                        0
                                }
                                sx={{
                                    minWidth:
                                        130,
                                    textTransform:
                                        "none",
                                    fontWeight:
                                        700,
                                }}
                            >
                                {couponBusy ? (
                                    <CircularProgress
                                        size={22}
                                        color="inherit"
                                    />
                                ) : (
                                    "Apply"
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="outlined"
                                color="error"
                                onClick={
                                    handleRemoveCoupon
                                }
                                disabled={
                                    checkoutLoading ||
                                    couponApplying
                                }
                                sx={{
                                    minWidth:
                                        130,
                                    textTransform:
                                        "none",
                                    fontWeight:
                                        700,
                                }}
                            >
                                Remove
                            </Button>
                        )}
                    </Stack>

                    {/* MESSAGE */}

                    {couponMessage && (
                        <Alert
                            severity={
                                hasAppliedCoupon
                                    ? "success"
                                    : "info"
                            }
                            sx={{
                                mt: 2,
                            }}
                        >
                            {couponMessage}
                        </Alert>
                    )}

                    {/* APPLIED COUPON DETAILS */}

                    {hasAppliedCoupon && (
                        <Alert
                            severity="success"
                            icon={
                                <CheckCircleOutline />
                            }
                            sx={{
                                mt: 2,
                            }}
                        >
                            Coupon{" "}
                            <strong>
                                {
                                    appliedCouponCode
                                }
                            </strong>{" "}
                            applied successfully.

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.5,
                                }}
                            >
                                Original subtotal:
                                Rs.{" "}
                                {formatPrice(
                                    subtotal
                                )}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="success.main"
                                fontWeight={700}
                            >
                                Discount: - Rs.{" "}
                                {formatPrice(
                                    discount
                                )}
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                            >
                                New total: Rs.{" "}
                                {formatPrice(
                                    finalTotal
                                )}
                            </Typography>

                            {safeEligibleProductIds.length >
                                0 && (
                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Discount applies to{" "}
                                    {
                                        safeEligibleProductIds.length
                                    }{" "}
                                    eligible product
                                    {safeEligibleProductIds.length !==
                                    1
                                        ? "s"
                                        : ""}
                                    .
                                </Typography>
                            )}

                            <Button
                                type="button"
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={
                                    handleRemoveCoupon
                                }
                                disabled={
                                    couponBusy
                                }
                                sx={{
                                    mt: 1,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Remove Coupon
                            </Button>
                        </Alert>
                    )}
                </Paper>

                {/* =================================================
                    PAYMENT
                ================================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                        borderRadius: 2,
                    }}
                >
                    <PaymentMethod
                        value={
                            paymentMethod
                        }
                        onChange={
                            handlePaymentMethodChange
                        }
                        disabled={
                            isLoading
                        }
                    />

                    {paymentMethodError && (
                        <Alert
                            severity="error"
                            sx={{
                                mt: 2,
                            }}
                        >
                            {
                                paymentMethodError
                            }
                        </Alert>
                    )}

                    {paymentMethod ===
                        "bank_transfer" && (
                        <BankTransferForm
                            transactionId={
                                transactionId
                            }
                            onTransactionIdChange={
                                setTransactionId
                            }
                            disabled={
                                isLoading
                            }
                        />
                    )}

                    {paymentMethod ===
                        "bank_transfer" &&
                        transactionIdError && (
                            <Alert
                                severity="error"
                                sx={{
                                    mt: 2,
                                }}
                            >
                                {
                                    transactionIdError
                                }
                            </Alert>
                        )}

                    {paymentMethod ===
                        "card" && (
                        <CardPaymentForm
                            disabled={
                                isLoading
                            }
                        />
                    )}

                    {paymentMethod ===
                        "cod" && (
                        <Alert
                            severity="info"
                            sx={{
                                mt: 2,
                            }}
                        >
                            You will pay when your
                            order is delivered.
                        </Alert>
                    )}
                </Paper>

                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Order Summary
                    </Typography>

                    <Stack spacing={1.5}>

                        {/* ORIGINAL SUBTOTAL */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Typography color="text.secondary">
                                Subtotal
                            </Typography>

                            <Typography fontWeight={600}>
                                Rs.{" "}
                                {formatPrice(
                                    subtotal
                                )}
                            </Typography>
                        </Stack>

                        {/* DISCOUNT */}

                        {hasAppliedCoupon && (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Box>
                                    <Typography
                                        color="success.main"
                                        fontWeight={600}
                                    >
                                        Coupon Discount
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                    >
                                        Code:{" "}
                                        {
                                            appliedCouponCode
                                        }
                                    </Typography>

                                    {Number(
                                        eligibleSubtotalFromServer
                                    ) > 0 && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            Eligible
                                            subtotal:
                                            Rs.{" "}
                                            {formatPrice(
                                                eligibleSubtotalFromServer
                                            )}
                                        </Typography>
                                    )}
                                </Box>

                                <Typography
                                    color="success.main"
                                    fontWeight={700}
                                >
                                    - Rs.{" "}
                                    {formatPrice(
                                        discount
                                    )}
                                </Typography>
                            </Stack>
                        )}

                        <Divider />

                        {/* FINAL TOTAL */}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="h6"
                                fontWeight={800}
                            >
                                Total
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={800}
                                color="primary"
                            >
                                Rs.{" "}
                                {formatPrice(
                                    finalTotal
                                )}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>

                {/* =================================================
                    PLACE ORDER
                ================================================= */}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={
                        isLoading ||
                        !shippingAddress.trim() ||
                        !paymentMethod ||
                        subtotal <= 0 ||
                        (
                            paymentMethod ===
                                "bank_transfer" &&
                            !transactionId.trim()
                        )
                    }
                    startIcon={
                        isLoading ? (
                            <CircularProgress
                                size={20}
                                color="inherit"
                            />
                        ) : (
                            <ShoppingCartCheckout />
                        )
                    }
                    sx={{
                        py: 1.5,
                        textTransform:
                            "none",
                        fontWeight: 700,
                        fontSize:
                            "1rem",
                    }}
                >
                    {checkoutLoading
                        ? "Placing Order..."
                        : `Place Order — Rs. ${formatPrice(
                              finalTotal
                          )}`}
                </Button>
            </Stack>
        </Box>
    );
};

export default CheckoutForm;