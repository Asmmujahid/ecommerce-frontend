// src/routes/AppRoutes.jsx

import {
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import SellerLayout from "../layouts/SellerLayout";
import CustomerLayout from "../layouts/CustomerLayout";

// =====================================================
// ROUTE GUARDS
// =====================================================

import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import SellerRoute from "./SellerRoute";
import CustomerRoute from "./CustomerRoute";

// =====================================================
// PUBLIC
// =====================================================

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";

import CustomerProducts from "../pages/Customer/Products/Products";
import CustomerProductDetails from "../pages/Customer/Products/ProductDetails";

import CustomerCategories from "../pages/customer/Categories/Categories";
import CustomerCategoryProducts from "../pages/customer/Categories/CategoryProducts";

import CustomerBrands from "../pages/Customer/Brands/Brands";
import CustomerBrandProducts from "../pages/Customer/Brands/BrandProducts";

import Banners from "../pages/Customer/Banners/Banners";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

// =====================================================
// CUSTOMER
// =====================================================

import Cart from "../pages/Customer/Cart/Cart";
import Wishlist from "../pages/Customer/Wishlist/Wishlist";

import CustomerDashboard from "../pages/Customer/Dashboard";

import CustomerOrders from "../pages/Customer/Orders/Orders";
import CustomerOrderDetails from "../pages/Customer/Orders/OrderDetails";

import Addresses from "../pages/Customer/Addresses/Addresses";

import Profile from "../pages/Customer/Profile/Profile";

import CheckoutPage from "../pages/Customer/Checkout/CheckoutPage";

import PaymentsPage from "../pages/Customer/Payments/PaymentsPage";
import PaymentDetailsPage from "../pages/Customer/Payments/PaymentDetailsPage";

import CouponsPage from "../pages/Customer/Coupons/CouponsPage";

import CustomerReviews from "../pages/Customer/Reviews/Reviews";
import CustomerReviewDetails from "../pages/Customer/Reviews/ReviewDetails";
import CustomerEditReview from "../pages/Customer/Reviews/EditReview";

import CustomerReturns from "../pages/Customer/Returns/Returns";
import CreateReturn from "../pages/Customer/Returns/CreateReturn";
import CustomerReturnDetails from "../pages/Customer/Returns/ReturnDetails";

import Notifications from "../pages/Customer/Notifications/Notifications";

// =====================================================
// SELLER
// =====================================================

import SellerDashboard from "../pages/Seller/Dashboard/Dashboard";

import ProductList from "../pages/Seller/Products/ProductList";
import CreateProduct from "../pages/Seller/Products/CreateProduct";
import ViewProduct from "../pages/Seller/Products/ViewProduct";
import EditProduct from "../pages/Seller/Products/EditProduct";
import ProductImages from "../pages/Seller/Products/ProductImages";
import ProductVariants from "../pages/Seller/Products/ProductVariants";

import Inventory from "../pages/Seller/Inventory/Inventory";
import CreateInventory from "../pages/Seller/Inventory/CreateInventory";
import EditInventory from "../pages/Seller/Inventory/EditInventory";
import ViewInventory from "../pages/Seller/Inventory/ViewInventory";

import Orders from "../pages/Seller/Orders/Orders";
import ViewOrder from "../pages/Seller/Orders/ViewOrder";

import Customers from "../pages/Seller/Customers/Customers";

import Coupons from "../pages/Seller/Coupons/Coupons";
import CreateCoupon from "../pages/Seller/Coupons/CreateCoupon";
import ViewCoupon from "../pages/Seller/Coupons/ViewCoupon";
import EditCoupon from "../pages/Seller/Coupons/EditCoupon";

import Payments from "../pages/Seller/Payments/Payments";
import Reviews from "../pages/Seller/Reviews/Reviews";
import Analytics from "../pages/Seller/Analytics/Analytics";
import Returns from "../pages/Seller/Returns/Returns";
import Store from "../pages/Seller/Store/Store";
import SellerProfile from "../pages/Seller/Profile/Profile";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "../pages/Admin/AdminDashboard";

// Categories
import Categories from "../pages/Admin/Categories/Categories";
import AddCategory from "../pages/Admin/Categories/AddCategory";
import EditCategory from "../pages/Admin/Categories/EditCategory";
import ViewCategory from "../pages/Admin/Categories/ViewCategory";

// Brands
import Brands from "../pages/Admin/Brands/Brands";
import AddBrand from "../pages/Admin/Brands/AddBrand";
import EditBrand from "../pages/Admin/Brands/EditBrand";
import ViewBrand from "../pages/Admin/Brands/ViewBrand";

// Products
import Products from "../pages/Admin/Products/Products";
import AddProduct from "../pages/Admin/Products/AddProduct";
import AdminEditProduct from "../pages/Admin/Products/EditProduct";
import AdminViewProduct from "../pages/Admin/Products/ViewProduct";

// Vendors
import Vendors from "../pages/Admin/Vendors/Vendors";
import VendorDetails from "../pages/Admin/Vendors/VendorDetails";
import EditVendor from "../pages/Admin/Vendors/EditVendor";

// Users
import Users from "../pages/Admin/Users/Users";
import EditUser from "../pages/Admin/Users/EditUser";
import ViewUser from "../pages/Admin/Users/ViewUser";

// Orders
import AdminOrders from "../pages/Admin/Orders/Orders";
import AdminViewOrder from "../pages/Admin/Orders/ViewOrder";
import AdminEditOrder from "../pages/Admin/Orders/EditOrder";

// Inventory
import InventoryList from "../pages/admin/Inventory/InventoryList";
import AddInventory from "../pages/admin/Inventory/AddInventory";
import AdminEditInventory from "../pages/admin/Inventory/EditInventory";

// Coupons
import AdminCoupons from "../pages/Admin/Coupons/Coupons";
import AdminAddCoupon from "../pages/Admin/Coupons/AddCoupon";
import AdminViewCoupon from "../pages/Admin/Coupons/ViewCoupon";
import AdminEditCoupon from "../pages/Admin/Coupons/EditCoupon";

// Banners
import AdminBanners from "../pages/Admin/Banners/Banners";
import AdminCreateBanner from "../pages/Admin/Banners/CreateBanner";
import AdminViewBanner from "../pages/Admin/Banners/ViewBanner";
import AdminEditBanner from "../pages/Admin/Banners/EditBanner";

// Reviews
import AdminReviews from "../pages/Admin/Reviews/Reviews";
import AdminViewReview from "../pages/Admin/Reviews/ViewReview";
import AdminEditReview from "../pages/Admin/Reviews/EditReview";

// Admin Payments 
import AdminPayments from "../pages/Admin/Payments/Payments"; 
import AdminViewPayment from "../pages/Admin/Payments/ViewPayment";
import AdminEditPayment from "../pages/Admin/Payments/EditPayment";

// Returns
import ReturnRequests from "../pages/Admin/ReturnRequests/ReturnRequests";
import ViewReturnRequest from "../pages/Admin/ReturnRequests/ViewReturnRequest";
import EditReturnRequest from "../pages/Admin/ReturnRequests/EditReturnRequest";

// Profile
import AdminProfile from "../pages/Admin/Profile/Profile";
import AdminEditProfile from "../pages/Admin/Profile/EditProfile";

// =====================================================
// 404
// =====================================================

import NotFound from "../pages/NotFound/NotFound";

// =====================================================
// ROUTES
// =====================================================

const AppRoutes = () => {
    const location = useLocation();

    /*
    |--------------------------------------------------------------------------
    | BACKGROUND LOCATION
    |--------------------------------------------------------------------------
    |
    | When Login/Register is opened from Home, React Router stores
    | the Home location inside location.state.backgroundLocation.
    |
    | This allows the Home page to remain visible underneath
    | the Login/Register modal.
    |
    */

    const backgroundLocation =
        location.state?.backgroundLocation;

    return (
        <>
            {/* =================================================
                MAIN ROUTES
            ================================================= */}

            <Routes
                location={
                    backgroundLocation || location
                }
            >

                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/shop"
                        element={<Shop />}
                    />

                    <Route
                        path="/products"
                        element={<CustomerProducts />}
                    />

                    <Route
                        path="/products/:id"
                        element={
                            <CustomerProductDetails />
                        }
                    />

                    <Route
                        path="/categories"
                        element={
                            <CustomerCategories />
                        }
                    />

                    <Route
                        path="/categories/:id/products"
                        element={
                            <CustomerCategoryProducts />
                        }
                    />

                    <Route
                        path="/brands"
                        element={<CustomerBrands />}
                    />

                    <Route
                        path="/brands/:id/products"
                        element={
                            <CustomerBrandProducts />
                        }
                    />

                    <Route
                        path="/banners"
                        element={<Banners />}
                    />

                </Route>

                {/* =================================================
                    AUTH ROUTES
                ================================================= */}

                <Route element={<GuestRoute />}>

                    <Route element={<AuthLayout />}>

                        {/*
                         * Login and Register are also valid
                         * direct routes.
                         *
                         * When accessed directly, they work
                         * normally.
                         */}

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />

                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                    </Route>

                </Route>

                {/* =================================================
                    CUSTOMER ROUTES
                ================================================= */}

                <Route element={<CustomerRoute />}>

                    <Route
                        path="/customer"
                        element={<CustomerLayout />}
                    >

                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={
                                <CustomerDashboard />
                            }
                        />

                        <Route
                            path="orders"
                            element={
                                <CustomerOrders />
                            }
                        />

                        <Route
                            path="orders/:id"
                            element={
                                <CustomerOrderDetails />
                            }
                        />

                        <Route
                            path="profile"
                            element={<Profile />}
                        />

                        <Route
                            path="addresses"
                            element={<Addresses />}
                        />

                        <Route
                            path="checkout"
                            element={
                                <CheckoutPage />
                            }
                        />

                        <Route
                            path="payments"
                            element={
                                <PaymentsPage />
                            }
                        />

                        <Route
                            path="payments/:id"
                            element={
                                <PaymentDetailsPage />
                            }
                        />

                        <Route
                            path="coupons"
                            element={
                                <CouponsPage />
                            }
                        />

                        <Route
                            path="reviews"
                            element={
                                <CustomerReviews />
                            }
                        />

                        <Route
                            path="reviews/:id"
                            element={
                                <CustomerReviewDetails />
                            }
                        />

                        <Route
                            path="reviews/:id/edit"
                            element={
                                <CustomerEditReview />
                            }
                        />

                        <Route
                            path="return-requests"
                            element={
                                <CustomerReturns />
                            }
                        />

                        <Route
                            path="return-requests/:id"
                            element={
                                <CustomerReturnDetails />
                            }
                        />

                        <Route
                            path="returns/create"
                            element={
                                <CreateReturn />
                            }
                        />

                        <Route
                            path="notifications"
                            element={
                                <Notifications />
                            }
                        />

                    </Route>

                    {/* Shopping */}

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/customer/wishlist"
                        element={<Wishlist />}
                    />

                </Route>

                {/* =================================================
                    ADMIN ROUTES
                ================================================= */}

                <Route element={<AdminRoute />}>

                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >

                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={
                                <AdminDashboard />
                            }
                        />

                        {/* Categories */}

                        <Route
                            path="categories"
                            element={<Categories />}
                        />

                        <Route
                            path="categories/create"
                            element={
                                <AddCategory />
                            }
                        />

                        <Route
                            path="categories/:id"
                            element={
                                <ViewCategory />
                            }
                        />

                        <Route
                            path="categories/:id/edit"
                            element={
                                <EditCategory />
                            }
                        />

                        {/* Brands */}

                        <Route
                            path="brands"
                            element={<Brands />}
                        />

                        <Route
                            path="brands/create"
                            element={
                                <AddBrand />
                            }
                        />

                        <Route
                            path="brands/view/:id"
                            element={
                                <ViewBrand />
                            }
                        />

                        <Route
                            path="brands/edit/:id"
                            element={
                                <EditBrand />
                            }
                        />

                        {/* Products */}

                        <Route
                            path="products"
                            element={<Products />}
                        />

                        <Route
                            path="products/create"
                            element={
                                <AddProduct />
                            }
                        />

                        <Route
                            path="products/view/:id"
                            element={
                                <AdminViewProduct />
                            }
                        />

                        <Route
                            path="products/edit/:id"
                            element={
                                <AdminEditProduct />
                            }
                        />

                        {/* Vendors */}

                        <Route
                            path="vendors"
                            element={<Vendors />}
                        />

                        <Route
                            path="vendors/view/:id"
                            element={
                                <VendorDetails />
                            }
                        />

                        <Route
                            path="vendors/edit/:id"
                            element={
                                <EditVendor />
                            }
                        />

                        {/* Users */}

                        <Route
                            path="users"
                            element={<Users />}
                        />

                        <Route
                            path="users/edit/:id"
                            element={
                                <EditUser />
                            }
                        />

                        <Route
                            path="users/view/:id"
                            element={
                                <ViewUser />
                            }
                        />

                        {/* Orders */}

                        <Route
                            path="orders"
                            element={<AdminOrders />}
                        />

                        <Route
                            path="orders/:id"
                            element={
                                <AdminViewOrder />
                            }
                        />

                        <Route
                            path="orders/:id/edit"
                            element={
                                <AdminEditOrder />
                            }
                        />

                        {/* Inventory */}

                        <Route
                            path="inventory"
                            element={
                                <InventoryList />
                            }
                        />

                        <Route
                            path="inventory/create"
                            element={
                                <AddInventory />
                            }
                        />

                        <Route
                            path="inventory/edit/:id"
                            element={
                                <AdminEditInventory />
                            }
                        />

                        {/* Coupons */}

                        <Route
                            path="coupons"
                            element={
                                <AdminCoupons />
                            }
                        />

                        <Route
                            path="coupons/create"
                            element={
                                <AdminAddCoupon />
                            }
                        />

                        <Route
                            path="coupons/view/:id"
                            element={
                                <AdminViewCoupon />
                            }
                        />

                        <Route
                            path="coupons/edit/:id"
                            element={
                                <AdminEditCoupon />
                            }
                        />

                        {/* Banners */}

                        <Route
                            path="banners"
                            element={
                                <AdminBanners />
                            }
                        />

                        <Route
                            path="banners/create"
                            element={
                                <AdminCreateBanner />
                            }
                        />

                        <Route
                            path="banners/view/:id"
                            element={
                                <AdminViewBanner />
                            }
                        />

                        <Route
                            path="banners/edit/:id"
                            element={
                                <AdminEditBanner />
                            }
                        />

                        {/* Reviews */}

                        <Route
                            path="reviews"
                            element={
                                <AdminReviews />
                            }
                        />

                        <Route
                            path="reviews/view/:id"
                            element={
                                <AdminViewReview />
                            }
                        />

                        <Route
                            path="reviews/edit/:id"
                            element={
                                <AdminEditReview />
                            }
                        />

                        {/* Payments */}
                        <Route path="/admin/payments"
                         element={
                         <AdminPayments />

                         } 
                         /> 
                         <Route path="/admin/payments/:id"
                          element={
                          <AdminViewPayment />
                          } 
                          /> 
                          <Route path="/admin/payments/:id/edit" 
                          element={
                          <AdminEditPayment />
                          } 
                          />

                        {/* Returns */}

                        <Route
                            path="return-requests"
                            element={
                                <ReturnRequests />
                            }
                        />

                        <Route
                            path="return-requests/view/:id"
                            element={
                                <ViewReturnRequest />
                            }
                        />

                        <Route
                            path="return-requests/edit/:id"
                            element={
                                <EditReturnRequest />
                            }
                        />

                        {/* Profile */}

                        <Route
                            path="profile"
                            element={
                                <AdminProfile />
                            }
                        />

                        <Route
                            path="profile/edit/:id"
                            element={
                                <AdminEditProfile />
                            }
                        />

                    </Route>

                </Route>

                {/* =================================================
                    SELLER ROUTES
                ================================================= */}

                <Route element={<SellerRoute />}>

                    <Route
                        path="/seller"
                        element={<SellerLayout />}
                    >

                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={
                                <SellerDashboard />
                            }
                        />

                        {/* Products */}

                        <Route
                            path="products"
                            element={<ProductList />}
                        />

                        <Route
                            path="products/create"
                            element={
                                <CreateProduct />
                            }
                        />

                        <Route
                            path="products/:id"
                            element={
                                <ViewProduct />
                            }
                        />

                        <Route
                            path="products/:id/edit"
                            element={
                                <EditProduct />
                            }
                        />

                        <Route
                            path="products/:id/images"
                            element={
                                <ProductImages />
                            }
                        />

                        <Route
                            path="products/:id/variants"
                            element={
                                <ProductVariants />
                            }
                        />

                        {/* Inventory */}

                        <Route
                            path="inventory"
                            element={<Inventory />}
                        />

                        <Route
                            path="inventory/create"
                            element={
                                <CreateInventory />
                            }
                        />

                        <Route
                            path="inventory/view/:id"
                            element={
                                <ViewInventory />
                            }
                        />

                        <Route
                            path="inventory/edit/:id"
                            element={
                                <EditInventory />
                            }
                        />

                        {/* Orders */}

                        <Route
                            path="orders"
                            element={<Orders />}
                        />

                        <Route
                            path="orders/:id"
                            element={
                                <ViewOrder />
                            }
                        />

                        {/* Customers */}

                        <Route
                            path="customers"
                            element={
                                <Customers />
                            }
                        />

                        {/* Coupons */}

                        <Route
                            path="coupons"
                            element={
                                <Coupons />
                            }
                        />

                        <Route
                            path="coupons/create"
                            element={
                                <CreateCoupon />
                            }
                        />

                        <Route
                            path="coupons/:id"
                            element={
                                <ViewCoupon />
                            }
                        />

                        <Route
                            path="coupons/:id/edit"
                            element={
                                <EditCoupon />
                            }
                        />

                        {/* Payments */}

                        <Route
                            path="payments"
                            element={
                                <Payments />
                            }
                        />

                        {/* Reviews */}

                        <Route
                            path="reviews"
                            element={
                                <Reviews />
                            }
                        />

                        {/* Analytics */}

                        <Route
                            path="analytics"
                            element={
                                <Analytics />
                            }
                        />

                        {/* Returns */}

                        <Route
                            path="returns"
                            element={
                                <Returns />
                            }
                        />

                        {/* Store */}

                        <Route
                            path="store"
                            element={
                                <Store />
                            }
                        />

                        {/* Profile */}

                        <Route
                            path="profile"
                            element={
                                <SellerProfile />
                            }
                        />

                    </Route>

                </Route>

                {/* =================================================
                    404
                ================================================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

            {/* =================================================
                AUTH MODAL ROUTES
            ================================================= */}

            {backgroundLocation && (
                <Routes>

                    <Route element={<GuestRoute />}>

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                    </Route>

                </Routes>
            )}
        </>
    );
};

export default AppRoutes;