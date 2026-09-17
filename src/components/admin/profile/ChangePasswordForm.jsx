import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    LockReset,
} from "@mui/icons-material";

import {
    changePassword,
    clearProfileMessage,
    clearProfileError,
} from "../../../redux/admin/profileSlice";

const ChangePasswordForm = () => {
    const dispatch = useDispatch();

    const { loading, successMessage, error } = useSelector(
        (state) => state.adminProfile
    );

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        if (!formData.current_password.trim()) {
            alert("Current password is required.");
            return false;
        }

        if (formData.new_password.length < 8) {
            alert("New password must be at least 8 characters.");
            return false;
        }

        if (
            formData.new_password !==
            formData.new_password_confirmation
        ) {
            alert("Passwords do not match.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(clearProfileError());
        dispatch(clearProfileMessage());

        if (!validate()) return;

        dispatch(
            changePassword({
                current_password: formData.current_password,
                new_password: formData.new_password,
                new_password_confirmation:
                    formData.new_password_confirmation,
            })
        ).then((res) => {
            if (!res.error) {
                setFormData({
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: "",
                });
            }
        });
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={3}
                >
                    <LockReset color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Change Password
                    </Typography>
                </Stack>

                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {successMessage}
                    </Alert>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            required
                            label="Current Password"
                            name="current_password"
                            type={
                                showCurrent
                                    ? "text"
                                    : "password"
                            }
                            value={
                                formData.current_password
                            }
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowCurrent(
                                                    !showCurrent
                                                )
                                            }
                                        >
                                            {showCurrent ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="New Password"
                            name="new_password"
                            type={
                                showNew
                                    ? "text"
                                    : "password"
                            }
                            value={
                                formData.new_password
                            }
                            onChange={handleChange}
                            helperText="Minimum 8 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowNew(
                                                    !showNew
                                                )
                                            }
                                        >
                                            {showNew ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Confirm Password"
                            name="new_password_confirmation"
                            type={
                                showConfirm
                                    ? "text"
                                    : "password"
                            }
                            value={
                                formData
                                    .new_password_confirmation
                            }
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirm(
                                                    !showConfirm
                                                )
                                            }
                                        >
                                            {showConfirm ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress
                                        size={22}
                                        color="inherit"
                                        sx={{
                                            mr: 1,
                                        }}
                                    />
                                    Updating...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChangePasswordForm;