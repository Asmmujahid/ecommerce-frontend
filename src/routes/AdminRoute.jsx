// src/routes/AdminRoute.jsx

import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";

const AdminRoute = () => {
    const location = useLocation();

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
    // NOT AUTHENTICATED
    // =====================================================

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    // =====================================================
    // GET ROLE
    // =====================================================

    const role =
        user?.roles?.[0]?.name ||
        user?.role ||
        localRole;

    // =====================================================
    // ADMIN ONLY
    // =====================================================

    if (role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
};

export default AdminRoute;

