// src/api/endpoints.js

const API = {
    // =====================================================
    // AUTHENTICATION
    // =====================================================

    LOGIN: "/login",

    REGISTER: "/register",

    LOGOUT: "/logout",

    FORGOT_PASSWORD: "/forgot-password",

    RESET_PASSWORD: "/reset-password",

    // =====================================================
    // PUBLIC
    // =====================================================

    BANNERS: "/banners",

    CATEGORIES: "/categories",

    CATEGORY_DETAILS: (id) =>
        `/categories/${id}`,

    CATEGORY_PRODUCTS: (id) =>
        `/categories/${id}/products`,

    BRANDS: "/brands",

    BRAND_DETAILS: (id) =>
        `/brands/${id}`,

    BRAND_PRODUCTS: (id) =>
        `/brands/${id}/products`,

    PRODUCTS: "/products",

    PRODUCT_DETAILS: (id) =>
        `/products/${id}`,

    PRODUCT_SEARCH: "/products/search",

    PRODUCT_FILTER: "/products/filter",

    // =====================================================
    // CUSTOMER DASHBOARD
    // =====================================================

    CUSTOMER_DASHBOARD:
        "/customer/dashboard",

    // =====================================================
    // CUSTOMER PROFILE
    // =====================================================

    PROFILE: "/customer/profile",

    CHANGE_PASSWORD:
        "/customer/change-password",

    // =====================================================
    // CUSTOMER CART
    // =====================================================

    CART: "/customer/cart",

    CART_ITEM: (id) =>
        `/customer/cart/${id}`,

    // =====================================================
    // CUSTOMER WISHLIST
    // =====================================================

    WISHLIST: "/customer/wishlists",

    WISHLIST_ITEM: (id) =>
        `/customer/wishlists/${id}`,

    // =====================================================
    // CUSTOMER ORDERS
    // =====================================================

    ORDERS: "/customer/orders",

    ORDER_DETAILS: (id) =>
        `/customer/orders/${id}`,

    // =====================================================
    // CUSTOMER CHECKOUT
    // =====================================================

    CHECKOUT: "/customer/checkout",

    // =====================================================
    // CUSTOMER PAYMENTS
    // =====================================================

    PAYMENTS: "/customer/payments",

    PAYMENT_DETAILS: (id) =>
        `/customer/payments/${id}`,

    // =====================================================
    // CUSTOMER REVIEWS
    // =====================================================

    REVIEWS: "/customer/reviews",

    REVIEW_DETAILS: (id) =>
        `/customer/reviews/${id}`,

    // =====================================================
    // CUSTOMER RETURN REQUESTS
    // =====================================================

    RETURN_REQUESTS:
        "/customer/return-requests",

    RETURNABLE_ITEMS:
        "/customer/return-requests/returnable-items",

    RETURN_REQUEST_DETAILS: (id) =>
        `/customer/return-requests/${id}`,

    // =====================================================
    // CUSTOMER COUPONS
    // =====================================================

    COUPONS_VALIDATE:
        "/customer/coupons/validate",

    COUPONS_APPLY:
        "/customer/coupons/apply",

    // =====================================================
    // CUSTOMER ADDRESSES
    // =====================================================

    ADDRESSES:
        "/customer/addresses",

    ADDRESS_DETAILS: (id) =>
        `/customer/addresses/${id}`,

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    NOTIFICATIONS: "/notifications",

    UNREAD_NOTIFICATIONS:
        "/notifications/unread",

    UNREAD_NOTIFICATION_COUNT:
        "/notifications/unread-count",

    NOTIFICATION_DETAILS: (id) =>
        `/notifications/${id}`,

    MARK_NOTIFICATION_READ: (id) =>
        `/notifications/${id}/read`,

    READ_ALL_NOTIFICATIONS:
        "/notifications/read-all",

    DELETE_NOTIFICATION: (id) =>
        `/notifications/${id}`,

    DELETE_ALL_NOTIFICATIONS:
        "/notifications",

    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    ADMIN_DASHBOARD:
        "/admin/dashboard",

    // =====================================================
    // ADMIN CATEGORIES
    // =====================================================

    ADMIN_CATEGORIES:
        "/admin/categories",

    ADMIN_CATEGORY_DETAILS: (id) =>
        `/admin/categories/${id}`,

    // =====================================================
    // ADMIN BRANDS
    // =====================================================

    ADMIN_BRANDS:
        "/admin/brands",

    ADMIN_BRAND_DETAILS: (id) =>
        `/admin/brands/${id}`,

    // =====================================================
    // ADMIN PRODUCTS
    // =====================================================

    ADMIN_PRODUCTS:
        "/admin/products",

    ADMIN_PRODUCT_DETAILS: (id) =>
        `/admin/products/${id}`,

    // =====================================================
    // ADMIN ORDERS
    // =====================================================

    ADMIN_ORDERS:
        "/admin/orders",

    ADMIN_ORDER_DETAILS: (id) =>
        `/admin/orders/${id}`,

    // =====================================================
    // ADMIN USERS
    // =====================================================

    ADMIN_USERS:
        "/admin/users",

    ADMIN_USER_DETAILS: (id) =>
        `/admin/users/${id}`,

    // =====================================================
    // ADMIN VENDORS
    // =====================================================

    ADMIN_VENDORS:
        "/admin/vendors",

    ADMIN_VENDOR_DETAILS: (id) =>
        `/admin/vendors/${id}`,

    // =====================================================
    // ADMIN COUPONS
    // =====================================================

    ADMIN_COUPONS:
        "/admin/coupons",

    ADMIN_COUPON_DETAILS: (id) =>
        `/admin/coupons/${id}`,

    // =====================================================
    // ADMIN BANNERS
    // =====================================================

    ADMIN_BANNERS:
        "/admin/banners",

    ADMIN_BANNER_DETAILS: (id) =>
        `/admin/banners/${id}`,

    // =====================================================
    // ADMIN PAYMENTS
    // =====================================================

    ADMIN_PAYMENTS:
        "/admin/payments",

    ADMIN_PAYMENT_DETAILS: (id) =>
        `/admin/payments/${id}`,

    // =====================================================
    // ADMIN INVENTORIES
    // =====================================================

    ADMIN_INVENTORIES:
        "/admin/inventories",

    ADMIN_INVENTORY_DETAILS: (id) =>
        `/admin/inventories/${id}`,

    // =====================================================
    // ADMIN REVIEWS
    // =====================================================

    ADMIN_REVIEWS:
        "/admin/reviews",

    ADMIN_REVIEW_DETAILS: (id) =>
        `/admin/reviews/${id}`,

    // =====================================================
    // ADMIN RETURN REQUESTS
    // =====================================================

    ADMIN_RETURN_REQUESTS:
        "/admin/return-requests",

    ADMIN_RETURN_REQUEST_DETAILS: (id) =>
        `/admin/return-requests/${id}`,

    // =====================================================
    // ADMIN PROFILE
    // =====================================================

    ADMIN_PROFILE:
        "/admin/profile",

    ADMIN_CHANGE_PASSWORD:
        "/admin/change-password",

    // =====================================================
    // SELLER DASHBOARD
    // =====================================================

    SELLER_DASHBOARD:
        "/seller/dashboard",

    // =====================================================
    // SELLER PROFILE
    // =====================================================

    SELLER_PROFILE:
        "/seller/profile",

    SELLER_CHANGE_PASSWORD:
        "/seller/change-password",

    // =====================================================
    // SELLER PRODUCTS
    // =====================================================

    SELLER_PRODUCTS:
        "/seller/products",

    SELLER_PRODUCT_DETAILS: (id) =>
        `/seller/products/${id}`,

    // =====================================================
    // SELLER PRODUCT IMAGES
    // =====================================================

    SELLER_PRODUCT_IMAGES: (productId) =>
        `/seller/products/${productId}/images`,

    SELLER_PRODUCT_IMAGE_DETAILS: (
        productId,
        imageId
    ) =>
        `/seller/products/${productId}/images/${imageId}`,

    // =====================================================
    // SELLER PRODUCT VARIANTS
    // =====================================================

    SELLER_PRODUCT_VARIANTS:
        "/seller/product-variants",

    SELLER_PRODUCT_VARIANTS_BY_PRODUCT: (
        productId
    ) =>
        `/seller/products/${productId}/variants`,

    SELLER_PRODUCT_VARIANT_DETAILS: (id) =>
        `/seller/product-variants/${id}`,

    // =====================================================
    // SELLER ORDERS
    // =====================================================

    SELLER_ORDERS:
        "/seller/orders",

    SELLER_ORDER_DETAILS: (id) =>
        `/seller/orders/${id}`,

    // =====================================================
    // SELLER INVENTORY
    // =====================================================

    SELLER_INVENTORIES:
        "/seller/inventories",

    SELLER_INVENTORY_DETAILS: (id) =>
        `/seller/inventories/${id}`,

    // =====================================================
    // SELLER REVIEWS
    // =====================================================

    SELLER_REVIEWS:
        "/seller/reviews",

    SELLER_REVIEW_DETAILS: (id) =>
        `/seller/reviews/${id}`,
};

export default API;

