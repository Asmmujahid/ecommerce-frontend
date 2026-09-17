// src/routes/GuestRoute.jsx

import {
    Navigate,
    Outlet,
} from "react-router-dom";

import { useSelector } from "react-redux";

const GuestRoute = () => {
    const {
        user,
        token,
        isAuthenticated,
    } = useSelector(
        (state) => state.auth || {}
    );

    const localToken =
        localStorage.getItem("token");

    const localRole =
        localStorage.getItem("role");

    const authToken =
        token || localToken;

    const isLoggedIn =
        Boolean(authToken) ||
        Boolean(isAuthenticated);

    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!isLoggedIn) {
        return <Outlet />;
    }

    // =====================================================
    // GET ROLE
    // =====================================================

    const role =
        user?.roles?.[0]?.name ||
        user?.role ||
        localRole;

    // =====================================================
    // REDIRECT AUTHENTICATED USER
    // =====================================================

    switch (role) {
        case "admin":
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );

        case "seller":
            return (
                <Navigate
                    to="/seller/dashboard"
                    replace
                />
            );

        case "customer":
            return (
                <Navigate
                    to="/customer/dashboard"
                    replace
                />
            );

        default:
            return (
                <Navigate
                    to="/"
                    replace
                />
            );
    }
};

export default GuestRoute;

