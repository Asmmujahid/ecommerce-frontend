// src/pages/Register/Register.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useForm,
} from "react-hook-form";

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
    PersonAddOutlined,
} from "@mui/icons-material";

import {
    IconButton,
} from "@mui/material";

import {
    register as registerUser,
    clearError,
} from "../../redux/authSlice";

const Register = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    // =====================================================
    // ROLE
    // =====================================================

    const [role, setRole] = useState("customer");

    // =====================================================
    // FORM
    // =====================================================

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors,
        },
    } = useForm({
        defaultValues: {
            role: "customer",
        },
    });

    const password = watch("password");

    // =====================================================
    // AUTH STATE
    // =====================================================

    const {
        loading,
        error,
        isAuthenticated,
        role: userRole,
        approvalStatus,
    } = useSelector(
        (state) => state.auth
    );

    // =====================================================
    // SUBMIT
    // =====================================================

    const onSubmit = (data) => {
        dispatch(
            registerUser({
                ...data,
                role,
            })
        );
    };

    // =====================================================
    // AUTH SUCCESS / SELLER PENDING
    // =====================================================

    useEffect(() => {
        /*
         * Only authenticated users should
         * be redirected.
         *
         * Pending seller:
         *
         * isAuthenticated = false
         *
         * Therefore they remain on this page.
         */

        if (
            isAuthenticated &&
            userRole
        ) {
            if (
                userRole ===
                "seller"
            ) {
                navigate(
                    "/seller/dashboard",
                    {
                        replace: true,
                    }
                );
            } else if (
                userRole ===
                "admin"
            ) {
                navigate(
                    "/admin/dashboard",
                    {
                        replace: true,
                    }
                );
            } else if (
                userRole ===
                "customer"
            ) {
                navigate(
                    "/",
                    {
                        replace: true,
                    }
                );
            } else {
                navigate(
                    "/",
                    {
                        replace: true,
                    }
                );
            }
        }

        return () => {
            dispatch(
                clearError()
            );
        };
    }, [
        isAuthenticated,
        userRole,
        navigate,
        dispatch,
    ]);

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
                bg-black/60
                backdrop-blur-sm
                overflow-y-auto
            "
            onClick={handleClose}
        >
            {/* =================================================
                SCROLLABLE PAGE CONTAINER
            ================================================= */}

            <div
                className="
                    min-h-full
                    w-full
                    flex
                    items-start
                    justify-center
                    px-3
                    py-6
                    sm:px-5
                    sm:py-8
                    md:py-10
                "
            >
                {/* =================================================
                    REGISTER CARD
                ================================================= */}

                <div
                    className="
                        relative
                        w-full
                        max-w-xl
                        rounded-2xl
                        bg-white
                        shadow-2xl
                        p-5
                        sm:p-7
                        md:p-8
                        my-2
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
                        aria-label="Close registration"
                        sx={{
                            position:
                                "absolute",

                            top: {
                                xs: 6,
                                sm: 10,
                            },

                            right: {
                                xs: 6,
                                sm: 10,
                            },

                            color:
                                "text.secondary",

                            zIndex: 10,

                            "&:hover": {
                                backgroundColor:
                                    "action.hover",
                            },
                        }}
                    >
                        <Close />
                    </IconButton>

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className="
                            flex
                            justify-center
                            mb-4
                            sm:mb-5
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                w-14
                                h-14
                                sm:w-16
                                sm:h-16
                                rounded-full
                                bg-blue-100
                                text-blue-600
                            "
                        >
                            <PersonAddOutlined
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
                        Create Account
                    </h1>

                    <p
                        className="
                            text-center
                            text-sm
                            sm:text-base
                            text-gray-500
                            mb-6
                        "
                    >
                        Create your account to continue
                    </p>

                    {/* =================================================
                        SUCCESS / SELLER PENDING MESSAGE
                    ================================================= */}

                    {approvalStatus ===
                        "pending" && (
                        <div
                            className="
                                bg-yellow-50
                                border
                                border-yellow-200
                                text-yellow-800
                                p-4
                                rounded-lg
                                mb-5
                                text-sm
                            "
                        >
                            <p className="font-semibold mb-1">
                                Registration successful!
                            </p>

                            <p>
                                Your seller account is
                                waiting for admin approval.
                            </p>

                            <p className="mt-1">
                                You cannot access the seller
                                dashboard until your account
                                is approved.
                            </p>

                            <p className="mt-2 font-medium">
                                After approval, you can log in
                                using your email and password.
                            </p>
                        </div>
                    )}

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error &&
                        approvalStatus !==
                            "pending" && (
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
                                    : "Registration failed"}
                            </div>
                        )}

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                    >
                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div className="mb-4">
                            <label
                                className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                autoComplete="name"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    p-3
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                {...register(
                                    "name",
                                    {
                                        required:
                                            "Name is required",
                                    }
                                )}
                            />

                            {errors.name && (
                                <p
                                    className="
                                        text-red-500
                                        text-sm
                                        mt-1
                                    "
                                >
                                    {
                                        errors.name
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="mb-4">
                            <label
                                className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    p-3
                                    outline-none
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

                        <div className="mb-4">
                            <label
                                className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                autoComplete="new-password"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    p-3
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                {...register(
                                    "password",
                                    {
                                        required:
                                            "Password is required",

                                        minLength: {
                                            value: 6,

                                            message:
                                                "Minimum 6 characters",
                                        },
                                    }
                                )}
                            />

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
                            CONFIRM PASSWORD
                        ================================================= */}

                        <div className="mb-4">
                            <label
                                className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    p-3
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                {...register(
                                    "password_confirmation",
                                    {
                                        required:
                                            "Confirm password is required",

                                        validate:
                                            (value) =>
                                                value ===
                                                    password ||
                                                "Passwords do not match",
                                    }
                                )}
                            />

                            {errors.password_confirmation && (
                                <p
                                    className="
                                        text-red-500
                                        text-sm
                                        mt-1
                                    "
                                >
                                    {
                                        errors
                                            .password_confirmation
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* =================================================
                            ROLE
                        ================================================= */}

                        <div className="mb-5">
                            <label
                                className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Account Type
                            </label>

                            <select
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    p-3
                                    outline-none
                                    bg-white
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                {...register(
                                    "role",
                                    {
                                        onChange: (
                                            event
                                        ) => {
                                            setRole(
                                                event
                                                    .target
                                                    .value
                                            );
                                        },
                                    }
                                )}
                            >
                                <option value="customer">
                                    Customer
                                </option>

                                <option value="seller">
                                    Seller
                                </option>
                            </select>
                        </div>

                        {/* =================================================
                            SELLER FIELDS
                        ================================================= */}

                        {role ===
                            "seller" && (
                            <>
                                {/* =================================================
                                    SELLER SECTION TITLE
                                ================================================= */}

                                <div
                                    className="
                                        border-t
                                        border-gray-200
                                        pt-5
                                        mb-5
                                    "
                                >
                                    <h2
                                        className="
                                            text-lg
                                            font-semibold
                                            text-gray-800
                                        "
                                    >
                                        Seller Information
                                    </h2>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        Complete your store
                                        information for admin
                                        approval.
                                    </p>
                                </div>

                                {/* =================================================
                                    STORE NAME
                                ================================================= */}

                                <div className="mb-4">
                                    <label
                                        className="
                                            block
                                            mb-2
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        Store Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter store name"
                                        autoComplete="organization"
                                        className="
                                            w-full
                                            border
                                            border-gray-300
                                            rounded-lg
                                            p-3
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                        {...register(
                                            "store_name",
                                            {
                                                required:
                                                    "Store name is required",
                                            }
                                        )}
                                    />

                                    {errors.store_name && (
                                        <p
                                            className="
                                                text-red-500
                                                text-sm
                                                mt-1
                                            "
                                        >
                                            {
                                                errors
                                                    .store_name
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* =================================================
                                    PHONE
                                ================================================= */}

                                <div className="mb-4">
                                    <label
                                        className="
                                            block
                                            mb-2
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        autoComplete="tel"
                                        className="
                                            w-full
                                            border
                                            border-gray-300
                                            rounded-lg
                                            p-3
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                        {...register(
                                            "phone",
                                            {
                                                required:
                                                    "Phone is required",
                                            }
                                        )}
                                    />

                                    {errors.phone && (
                                        <p
                                            className="
                                                text-red-500
                                                text-sm
                                                mt-1
                                            "
                                        >
                                            {
                                                errors
                                                    .phone
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* =================================================
                                    ADDRESS
                                ================================================= */}

                                <div className="mb-5">
                                    <label
                                        className="
                                            block
                                            mb-2
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        Address
                                    </label>

                                    <textarea
                                        rows="4"
                                        placeholder="Enter address"
                                        autoComplete="street-address"
                                        className="
                                            w-full
                                            border
                                            border-gray-300
                                            rounded-lg
                                            p-3
                                            outline-none
                                            resize-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                        {...register(
                                            "address",
                                            {
                                                required:
                                                    "Address is required",
                                            }
                                        )}
                                    />

                                    {errors.address && (
                                        <p
                                            className="
                                                text-red-500
                                                text-sm
                                                mt-1
                                            "
                                        >
                                            {
                                                errors
                                                    .address
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* =================================================
                            REGISTER BUTTON
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
                                ? "Creating Account..."
                                : "Register"}
                        </button>

                        {/* =================================================
                            LOGIN LINK
                        ================================================= */}

                        <div
                            className="
                                text-center
                                mt-5
                                text-sm
                                sm:text-base
                                text-gray-600
                            "
                        >
                            Already have an account?{" "}

                            <Link
                                to="/login"
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
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
