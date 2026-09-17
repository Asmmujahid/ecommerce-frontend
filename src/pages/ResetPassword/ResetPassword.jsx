import { useEffect } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    resetPassword,
    clearError,
} from "../../redux/authSlice";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Get token and email from reset link
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    /*
    |--------------------------------------------------------------------------
    | Clear old Redux error when page opens
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        dispatch(clearError());

        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const onSubmit = async (data) => {
        // Token or email missing
        if (!token || !email) {
            return;
        }

        try {
            await dispatch(
                resetPassword({
                    token: token,
                    email: email,
                    password: data.password,
                    password_confirmation:
                        data.password_confirmation,
                })
            ).unwrap();

            alert(
                "Password reset successfully. You can now login with your new password."
            );

            reset();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Invalid Reset Link
    |--------------------------------------------------------------------------
    */

    if (!token || !email) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    px: 2,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        width: "100%",
                        maxWidth: 500,
                        p: { xs: 3, sm: 4 },
                        textAlign: "center",
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Invalid Reset Link
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        The password reset link is missing
                        the required information. Please
                        request a new password reset link.
                    </Typography>

                    <Button
                        component={Link}
                        to="/forgot-password"
                        variant="contained"
                        fullWidth
                    >
                        Request New Reset Link
                    </Button>

                    <Box sx={{ mt: 2 }}>
                        <Button
                            component={Link}
                            to="/login"
                            variant="text"
                        >
                            Back to Login
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Reset Password Form
    |--------------------------------------------------------------------------
    */

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                px: 2,
                py: 4,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 2,
                }}
            >
                {/* Heading */}

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    gutterBottom
                >
                    Reset Password
                </Typography>

                <Typography
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mb: 3 }}
                >
                    Create a new password for your account.
                </Typography>

                {/* Error */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {typeof error === "string"
                            ? error
                            : "Failed to reset password."}
                    </Alert>
                )}

                {/* Form */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    {/* Email */}

                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    {/* New Password */}

                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        margin="normal"
                        autoComplete="new-password"
                        disabled={loading}
                        {...register("password", {
                            required:
                                "Password is required.",

                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters.",
                            },
                        })}
                        error={Boolean(errors.password)}
                        helperText={
                            errors.password?.message
                        }
                    />

                    {/* Confirm Password */}

                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        margin="normal"
                        autoComplete="new-password"
                        disabled={loading}
                        {...register(
                            "password_confirmation",
                            {
                                required:
                                    "Please confirm your password.",

                                validate: (
                                    value,
                                    formValues
                                ) =>
                                    value ===
                                        formValues.password ||
                                    "Passwords do not match.",
                            }
                        )}
                        error={Boolean(
                            errors.password_confirmation
                        )}
                        helperText={
                            errors.password_confirmation
                                ?.message
                        }
                    />

                    {/* Submit */}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 3,
                            py: 1.5,
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress
                                    size={22}
                                    color="inherit"
                                    sx={{ mr: 1 }}
                                />

                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>

                {/* Login */}

                <Box
                    sx={{
                        textAlign: "center",
                        mt: 3,
                    }}
                >
                    <Link
                        to="/login"
                        style={{
                            color: "#1976d2",
                            textDecoration: "none",
                        }}
                    >
                        ← Back to Login
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default ResetPassword;