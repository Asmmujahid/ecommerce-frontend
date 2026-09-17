import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
    forgotPassword,
    clearError,
} from "../../redux/authSlice";

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
        },
    });

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        dispatch(clearError());

        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data) => {
        try {
            await dispatch(
                forgotPassword({
                    email: data.email.trim(),
                })
            ).unwrap();

            alert(
                "Password reset link sent successfully. Please check your email."
            );

            reset();
        } catch (error) {
            console.error(
                "Forgot password error:",
                error
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                {/* Heading */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Forgot Password
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Enter your registered email address
                        and we will send you a password
                        reset link.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-lg bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {typeof error === "string"
                            ? error
                            : "Unable to send password reset link."}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <div className="mb-5">
                        <label
                            htmlFor="forgot-email"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>

                        <input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="off"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            disabled={loading}
                            className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                                errors.email
                                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            }`}
                            {...register("email", {
                                required:
                                    "Email is required.",

                                pattern: {
                                    value:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        "Please enter a valid email address.",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;