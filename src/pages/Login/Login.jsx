// src/pages/Login/Login.jsx

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Close,
    LockOutlined,
    PersonOutline,
} from "@mui/icons-material";

import { IconButton } from "@mui/material";

import {
    login,
    clearError,
} from "../../redux/authSlice";

const Login = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    // =====================================================
    // FORM
    // =====================================================

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // =====================================================
    // AUTH STATE
    // =====================================================

    const {
        loading,
        error,
        role,
        isAuthenticated,
        approvalStatus,
    } = useSelector(
        (state) => state.auth
    );

    // =====================================================
    // SUBMIT
    // =====================================================

    const onSubmit = (data) => {
        dispatch(login(data));
    };

    // =====================================================
    // REDIRECT ONLY AFTER REAL LOGIN
    // =====================================================

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        switch (role) {
            case "admin":
                navigate(
                    "/admin/dashboard",
                    {
                        replace: true,
                    }
                );
                break;

            case "seller":
                navigate(
                    "/seller/dashboard",
                    {
                        replace: true,
                    }
                );
                break;

            case "customer":
                navigate(
                    "/customer/dashboard",
                    {
                        replace: true,
                    }
                );
                break;

            default:
                navigate(
                    "/",
                    {
                        replace: true,
                    }
                );
        }
    }, [
        isAuthenticated,
        role,
        navigate,
    ]);

    // =====================================================
    // CLEAR ERROR ON UNMOUNT
    // =====================================================

    useEffect(() => {
        return () => {
            dispatch(
                clearError()
            );
        };
    }, [dispatch]);

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        if (
            location.state?.backgroundLocation
        ) {
            navigate(-1);

            return;
        }

        navigate("/", {
            replace: true,
        });
    };

    // =====================================================
    // BACKGROUND LOCATION
    // =====================================================

    const backgroundLocation =
        location.state?.backgroundLocation;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/60
                backdrop-blur-sm
                p-4
                overflow-y-auto
            "
            onClick={handleClose}
        >
            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div
                className="
                    relative
                    w-full
                    max-w-md
                    rounded-2xl
                    bg-white
                    shadow-2xl
                    p-6
                    sm:p-8
                    my-4
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* =================================================
                    CLOSE BUTTON
                ================================================= */}

                <IconButton
                    onClick={handleClose}
                    aria-label="Close login"
                    sx={{
                        position:
                            "absolute",

                        top: 10,

                        right: 10,

                        color:
                            "text.secondary",

                        "&:hover": {
                            backgroundColor:
                                "action.hover",
                        },
                    }}
                >
                    <Close />
                </IconButton>

                {/* =================================================
                    ICON
                ================================================= */}

                <div
                    className="
                        flex
                        justify-center
                        mb-4
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            w-16
                            h-16
                            rounded-full
                            bg-blue-100
                            text-blue-600
                        "
                    >
                        <LockOutlined
                            fontSize="large"
                        />
                    </div>
                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <h1
                    className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-center
                        text-gray-800
                        mb-2
                    "
                >
                    Welcome Back
                </h1>

                <p
                    className="
                        text-center
                        text-gray-500
                        mb-6
                    "
                >
                    Login to your account
                </p>

                {/* =================================================
                    PENDING SELLER MESSAGE
                ================================================= */}

                {approvalStatus ===
                    "pending" ? (
                    <div
                        className="
                            bg-yellow-50
                            border
                            border-yellow-300
                            text-yellow-800
                            p-4
                            rounded-lg
                            mb-5
                            text-sm
                        "
                    >
                        <p className="font-semibold mb-1">
                            Seller account pending
                        </p>

                        <p>
                            Your seller account is waiting
                            for admin approval. You can
                            login after your account has
                            been approved.
                        </p>
                    </div>
                ) : (
                    error && (
                        <div
                            className="
                                bg-red-50
                                border
                                border-red-200
                                text-red-700
                                p-3
                                rounded-lg
                                mb-5
                                text-sm
                            "
                        >
                            {typeof error ===
                            "string"
                                ? error
                                : "Login failed"}
                        </div>
                    )
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    autoComplete="off"
                >
                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <div className="mb-5">
                        <label
                            htmlFor="login-email"
                            className="
                                block
                                mb-2
                                font-medium
                                text-gray-700
                            "
                        >
                            Email
                        </label>

                        <div className="relative">
                            <PersonOutline
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                id="login-email"
                                name="login-email"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="off"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck="false"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    py-3
                                    pl-11
                                    pr-4
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                {...register(
                                    "email",
                                    {
                                        required:
                                            "Email is required",

                                        pattern: {
                                            value:
                                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                            message:
                                                "Enter a valid email address",
                                        },
                                    }
                                )}
                            />
                        </div>

                        {errors.email && (
                            <p
                                className="
                                    text-red-500
                                    text-sm
                                    mt-1
                                "
                            >
                                {
                                    errors.email
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        PASSWORD
                    ================================================= */}

                    <div className="mb-5">
                        <label
                            htmlFor="login-password"
                            className="
                                block
                                mb-2
                                font-medium
                                text-gray-700
                            "
                        >
                            Password
                        </label>

                        <div className="relative">
                            <LockOutlined
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                id="login-password"
                                name="login-password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="new-password"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    py-3
                                    pl-11
                                    pr-4
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                {...register(
                                    "password",
                                    {
                                        required:
                                            "Password is required",
                                    }
                                )}
                            />
                        </div>

                        {errors.password && (
                            <p
                                className="
                                    text-red-500
                                    text-sm
                                    mt-1
                                "
                            >
                                {
                                    errors.password
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        PASSWORD LINKS
                    ================================================= */}

                    <div
                        className="
                            flex
                            justify-between
                            items-center
                            mb-6
                            text-sm
                        "
                    >
                        <Link
                            to="/forgot-password"
                            className="
                                text-blue-600
                                hover:text-blue-700
                                hover:underline
                            "
                        >
                            Forgot Password?
                        </Link>

                        <Link
                            to="/reset-password"
                            className="
                                text-blue-600
                                hover:text-blue-700
                                hover:underline
                            "
                        >
                            Reset Password?
                        </Link>
                    </div>

                    {/* =================================================
                        LOGIN BUTTON
                    ================================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-600
                            text-white
                            py-3
                            rounded-lg
                            font-semibold
                            transition
                            hover:bg-blue-700
                            disabled:bg-blue-400
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Logging In..."
                            : "Login"}
                    </button>
                </form>

                {/* =================================================
                    REGISTER
                ================================================= */}

                <div
                    className="
                        text-center
                        mt-6
                        text-gray-600
                    "
                >
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        state={{
                            backgroundLocation:
                                backgroundLocation,
                        }}
                        className="
                            text-blue-600
                            font-semibold
                            hover:underline
                        "
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
