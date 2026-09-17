// src/app/rootReducer.js

import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../redux/authSlice";

// Public
import customerBannerReducer from "../redux/customer/bannerSlice";
import categoryReducer from "../redux/customer/categorySlice";
import customerBrandReducer from "../redux/customer/brandSlice";
import productReducer from "../redux/customer/productSlice";

// Customer
import cartReducer from "../redux/customer/cartSlice";
import customerWishlistReducer from "../redux/customer/wishlistSlice";
import checkoutReducer from "../redux/customer/checkoutSlice";
import customerOrdersReducer from "../redux/customer/orderSlice";
import customerProfileReducer from "../redux/customer/profileSlice";
import addressReducer from "../redux/customer/addressSlice";
import reviewReducer from "../redux/customer/reviewSlice";
import customerPaymentReducer from "../redux/customer/paymentSlice";
import couponReducer from "../redux/customer/couponSlice";
import customerReturnReducer from "../redux/customer/returnRequestSlice";
import customerDashboardReducer from "../redux/customer/dashboardSlice";

// UI
import uiReducer from "../redux/ui/uiSlice";
import notificationReducer from "../redux/notificationSlice";

// Seller
import sellerDashboardReducer from "../redux/seller/sellerDashboardSlice";
import sellerProductReducer from "../redux/seller/sellerProductSlice";
import sellerCategoryReducer from "../redux/seller/sellerCategorySlice";
import sellerBrandReducer from "../redux/seller/sellerBrandSlice";
import sellerInventoryReducer from "../redux/seller/sellerInventorySlice";
import sellerOrderReducer from "../redux/seller/sellerOrderSlice";
import sellerCustomerReducer from "../redux/seller/sellerCustomerSlice";
import sellerCouponReducer from "../redux/seller/sellerCouponSlice";
import sellerPaymentReducer from "../redux/seller/sellerPaymentSlice";
import sellerReviewReducer from "../redux/seller/sellerReviewSlice";
import sellerAnalyticsReducer from "../redux/seller/sellerAnalyticsSlice";
import sellerReturnReducer from "../redux/seller/sellerReturnSlice";
import sellerStoreReducer from "../redux/seller/sellerStoreSlice";
import sellerProfileReducer from "../redux/seller/sellerProfileSlice";

// Admin
import adminDashboardReducer from "../redux/admin/dashboardSlice";
import adminCategoryReducer from "../redux/admin/categorySlice";
import adminBrandReducer from "../redux/admin/brandSlice";
import adminProductReducer from "../redux/admin/productSlice";
import adminVendorReducer from "../redux/admin/vendorSlice";
import adminUserReducer from "../redux/admin/userSlice";
import adminOrderReducer from "../redux/admin/orderSlice";
import adminInventoryReducer from "../redux/admin/inventorySlice";
import adminCouponReducer from "../redux/admin/couponSlice";
import adminBannerReducer from "../redux/admin/bannerSlice";
import adminReviewReducer from "../redux/admin/reviewSlice";
import adminPaymentReducer from "../redux/admin/paymentSlice";
import adminReturnRequestReducer from "../redux/admin/returnRequestSlice";
import adminProfileReducer from "../redux/admin/profileSlice";

// =====================================================
// ROOT REDUCER
// =====================================================

const rootReducer = combineReducers({
    // Authentication
    auth: authReducer,

    // Notifications
    notifications: notificationReducer,

    // =================================================
    // PUBLIC
    // =================================================

    customerBanner: customerBannerReducer,

    customerCategory: categoryReducer,

    customerBrand: customerBrandReducer,

    customerProduct: productReducer,

    // =================================================
    // CUSTOMER
    // =================================================

    customerCart: cartReducer,

    customerWishlist: customerWishlistReducer,

    customerCheckout: checkoutReducer,

    customerOrders: customerOrdersReducer,

   customerProfile: customerProfileReducer,

    address: addressReducer,

    customerReview: reviewReducer,

    customerPayment: customerPaymentReducer,

    customerCoupon: couponReducer,

    customerReturn: customerReturnReducer,

    customerDashboard:
        customerDashboardReducer,

    // =================================================
    // SELLER
    // =================================================

    sellerDashboard:
        sellerDashboardReducer,

    sellerProducts:
        sellerProductReducer,

    sellerCategories:
        sellerCategoryReducer,

    sellerBrands:
        sellerBrandReducer,

    sellerInventory:
        sellerInventoryReducer,

    sellerOrders:
        sellerOrderReducer,

    sellerCustomer:
        sellerCustomerReducer,

    sellerCoupon:
        sellerCouponReducer,

    sellerPayment:
        sellerPaymentReducer,

    sellerReview:
        sellerReviewReducer,

    sellerAnalytics:
        sellerAnalyticsReducer,

    sellerReturn:
        sellerReturnReducer,

    sellerStore:
        sellerStoreReducer,

    sellerProfile:
        sellerProfileReducer,

    // =================================================
    // ADMIN
    // =================================================

    adminDashboard:
        adminDashboardReducer,

    adminCategory:
        adminCategoryReducer,

    adminBrand:
        adminBrandReducer,

    adminProduct:
        adminProductReducer,

    adminVendor:
        adminVendorReducer,

    adminUser:
        adminUserReducer,

    adminOrder:
        adminOrderReducer,

    adminInventory:
        adminInventoryReducer,

    adminCoupon:
        adminCouponReducer,

    adminBanner:
        adminBannerReducer,

    adminReview:
        adminReviewReducer,

    adminPayment:
        adminPaymentReducer,

    adminReturnRequest:
        adminReturnRequestReducer,

    adminProfile:
        adminProfileReducer,

    // =================================================
    // UI
    // =================================================

    ui: uiReducer,
});

export default rootReducer;