// src/routes/ProtectedRoute.jsx

import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const location = useLocation();

    const {
        token,
        isAuthenticated,
    } = useSelector(
        (state) => state.auth || {}
    );

    const localToken =
        localStorage.getItem("token");

    const isLoggedIn =
        Boolean(token) ||
        Boolean(localToken) ||
        Boolean(isAuthenticated);

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

    return <Outlet />;
};

export default ProtectedRoute;

