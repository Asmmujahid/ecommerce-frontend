// src/components/customer/profile/ChangePasswordDialog.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";

import {
    changeCustomerPassword,
    clearProfileError,
    clearProfileMessage,
} from "../../../redux/customer/ProfileSlice";

// =====================================================
// COMPONENT
// =====================================================

const ChangePasswordDialog = ({
    open,
    onClose,
}) => {
    const dispatch = useDispatch();

    // =================================================
    // REDUX STATE
    // =================================================

    const customerProfile =
        useSelector(
            (state) =>
                state.customerProfile
        );

    const changingPassword =
        customerProfile
            ?.changingPassword ?? false;

    const error =
        customerProfile?.error ?? null;

    const message =
        customerProfile?.message ?? "";

    const validationErrors =
        customerProfile
            ?.validationErrors ?? {};

    // =================================================
    // LOCAL STATE
    // =================================================

    const [formData, setFormData] =
        useState({
            current_password: "",
            new_password: "",
            new_password_confirmation:
                "",
        });

    const [confirmError, setConfirmError] =
        useState("");

    // =================================================
    // RESET FORM
    // =================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormData({
            current_password: "",
            new_password: "",
            new_password_confirmation:
                "",
        });

        setConfirmError("");

        dispatch(clearProfileError());
        dispatch(clearProfileMessage());
    }, [open, dispatch]);

    // =================================================
    // INPUT CHANGE
    // =================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        if (error) {
            dispatch(
                clearProfileError()
            );
        }

        if (
            name === "new_password" ||
            name ===
                "new_password_confirmation"
        ) {
            setConfirmError("");
        }
    };

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        // Password match
        if (
            formData.new_password !==
            formData
                .new_password_confirmation
        ) {
            setConfirmError(
                "New passwords do not match."
            );

            return;
        }

        // Password length
        if (
            formData.new_password.length <
            8
        ) {
            setConfirmError(
                "New password must be at least 8 characters."
            );

            return;
        }

        const result =
            await dispatch(
                changeCustomerPassword(
                    formData
                )
            );

        if (
            changeCustomerPassword.fulfilled.match(
                result
            )
        ) {
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    };

    // =================================================
    // CLOSE
    // =================================================

    const handleClose = () => {
        if (!changingPassword) {
            onClose();
        }
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Change Password
            </DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <DialogContent>
                    <Stack
                        spacing={2}
                        sx={{
                            mt: 1,
                        }}
                    >
                        {/* ERROR */}

                        {error && (
                            <Alert
                                severity="error"
                                onClose={() =>
                                    dispatch(
                                        clearProfileError()
                                    )
                                }
                            >
                                {typeof error ===
                                "string"
                                    ? error
                                    : error?.message ||
                                      "Something went wrong."}
                            </Alert>
                        )}

                        {/* SUCCESS */}

                        {message && (
                            <Alert severity="success">
                                {message}
                            </Alert>
                        )}

                        {/* CURRENT PASSWORD */}

                        <TextField
                            fullWidth
                            required
                            type="password"
                            label="Current Password"
                            name="current_password"
                            value={
                                formData.current_password
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                changingPassword
                            }
                            error={Boolean(
                                validationErrors
                                    ?.current_password
                            )}
                            helperText={
                                validationErrors
                                    ?.current_password?.[0] ||
                                ""
                            }
                        />

                        {/* NEW PASSWORD */}

                        <TextField
                            fullWidth
                            required
                            type="password"
                            label="New Password"
                            name="new_password"
                            value={
                                formData.new_password
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                changingPassword
                            }
                            error={
                                Boolean(
                                    confirmError
                                ) &&
                                formData
                                    .new_password
                                    .length < 8
                            }
                            helperText={
                                validationErrors
                                    ?.new_password?.[0] ||
                                "Minimum 8 characters"
                            }
                        />

                        {/* CONFIRM PASSWORD */}

                        <TextField
                            fullWidth
                            required
                            type="password"
                            label="Confirm New Password"
                            name="new_password_confirmation"
                            value={
                                formData.new_password_confirmation
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                changingPassword
                            }
                            error={
                                Boolean(
                                    confirmError
                                ) ||
                                Boolean(
                                    validationErrors
                                        ?.new_password_confirmation
                                )
                            }
                            helperText={
                                confirmError ||
                                validationErrors
                                    ?.new_password_confirmation?.[0] ||
                                ""
                            }
                        />
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >
                    <Button
                        onClick={
                            handleClose
                        }
                        color="inherit"
                        disabled={
                            changingPassword
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={
                            changingPassword
                        }
                    >
                        {changingPassword ? (
                            <CircularProgress
                                size={22}
                                color="inherit"
                            />
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ChangePasswordDialog;