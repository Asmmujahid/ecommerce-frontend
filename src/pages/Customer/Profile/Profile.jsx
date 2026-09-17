// src/pages/Customer/Profile/Profile.jsx

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
    CircularProgress,
    Snackbar,
} from "@mui/material";

import {
    getCustomerProfile,
    updateCustomerProfile,
    deleteCustomerAccount,
    clearProfileError,
    clearProfileMessage,
} from "../../../redux/customer/ProfileSlice";

import { updateUser } from "../../../redux/authSlice";

import ProfileHeader from "../../../components/customer/profile/ProfileHeader";
import ProfileCard from "../../../components/customer/profile/ProfileCard";
import ProfileForm from "../../../components/customer/profile/ProfileForm";
import ChangePasswordDialog from "../../../components/customer/profile/ChangePasswordDialog";
import DeleteAccountCard from "../../../components/customer/profile/DeleteAccountCard";

// =====================================================
// COMPONENT
// =====================================================

const Profile = () => {
    const dispatch = useDispatch();

    // =================================================
    // CUSTOMER PROFILE STATE
    // =================================================

    const customerProfile = useSelector(
        (state) =>
            state.customerProfile
    );

    const {
        profile = null,
        loading = false,
        updating = false,
        deleting = false,
        error = null,
        message = "",
        success = false,
        validationErrors = {},
    } =
        customerProfile || {};

    // =================================================
    // LOCAL FORM STATE
    // =================================================

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            phone: "",
            avatar: "",
        });

    // =================================================
    // PASSWORD DIALOG
    // =================================================

    const [
        passwordDialogOpen,
        setPasswordDialogOpen,
    ] = useState(false);

    // =================================================
    // SNACKBAR
    // =================================================

    const [
        snackbarOpen,
        setSnackbarOpen,
    ] = useState(false);

    // =================================================
    // GET PROFILE
    // =================================================

    useEffect(() => {
        dispatch(
            getCustomerProfile()
        );
    }, [dispatch]);

    // =================================================
    // LOAD PROFILE INTO FORM
    // =================================================

    useEffect(() => {
        if (!profile) {
            return;
        }

        setFormData({
            name:
                typeof profile.name ===
                "string"
                    ? profile.name
                    : "",

            email:
                typeof profile.email ===
                "string"
                    ? profile.email
                    : "",

            phone:
                typeof profile.phone ===
                "string"
                    ? profile.phone
                    : "",

            avatar:
                typeof profile.avatar ===
                "string"
                    ? profile.avatar
                    : "",
        });
    }, [profile]);

    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    useEffect(() => {
        if (
            success &&
            message
        ) {
            setSnackbarOpen(true);
        }
    }, [
        success,
        message,
    ]);

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
    };

    // =================================================
    // UPDATE PROFILE
    // =================================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            const cleanData = {
                name:
                    formData.name.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                avatar:
                    formData.avatar.trim(),
            };

            const result =
                await dispatch(
                    updateCustomerProfile(
                        cleanData
                    )
                );

            // =================================================
            // SUCCESS
            // =================================================

            if (
                updateCustomerProfile.fulfilled.match(
                    result
                )
            ) {
                /*
                 * Laravel response:
                 *
                 * {
                 *     success: true,
                 *     message: "...",
                 *     data: {
                 *         id: 1,
                 *         name: "...",
                 *         email: "...",
                 *         phone: "...",
                 *         avatar: "..."
                 *     }
                 * }
                 */

                const updatedProfile =
                    result.payload?.data;

                /*
                 * IMPORTANT:
                 *
                 * Topbar and Sidebar use:
                 *
                 * state.auth.user
                 *
                 * Therefore update auth.user
                 * immediately after successful
                 * profile update.
                 */

                if (
                    updatedProfile
                ) {
                    dispatch(
                        updateUser(
                            updatedProfile
                        )
                    );
                }

                setSnackbarOpen(
                    true
                );
            }
        };

    // =================================================
    // DELETE ACCOUNT
    // =================================================

    const handleDeleteAccount =
        async () => {
            const confirmed =
                window.confirm(
                    "Are you sure you want to permanently delete your account?"
                );

            if (!confirmed) {
                return;
            }

            const result =
                await dispatch(
                    deleteCustomerAccount()
                );

            if (
                deleteCustomerAccount.fulfilled.match(
                    result
                )
            ) {
                console.log(
                    "Account deleted successfully."
                );
            }
        };

    // =================================================
    // CLOSE SNACKBAR
    // =================================================

    const handleSnackbarClose =
        () => {
            setSnackbarOpen(
                false
            );

            dispatch(
                clearProfileMessage()
            );
        };

    // =================================================
    // LOADING
    // =================================================

    if (
        loading &&
        !profile
    ) {
        return (
            <Box
                sx={{
                    minHeight:
                        "60vh",

                    display:
                        "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center",
                }}
            >
                <CircularProgress
                    size={45}
                />
            </Box>
        );
    }

    // =================================================
    // PAGE
    // =================================================

    return (
        <Box
            sx={{
                width: "100%",

                maxWidth: 1200,

                mx: "auto",

                px: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                },

                py: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                },
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <ProfileHeader />

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
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

            {/* =================================================
                PROFILE
            ================================================= */}

            {!profile &&
            !loading ? (
                <Alert severity="warning">
                    Customer profile could
                    not be loaded.
                </Alert>
            ) : (
                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns:
                            {
                                xs: "1fr",
                                md: "300px minmax(0, 1fr)",
                            },

                        gap: {
                            xs: 2,
                            md: 3,
                        },

                        alignItems:
                            "start",
                    }}
                >
                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <ProfileCard
                            profile={
                                profile
                            }
                            onChangePassword={() =>
                                setPasswordDialogOpen(
                                    true
                                )
                            }
                        />

                        <DeleteAccountCard
                            deleting={
                                deleting
                            }
                            onDelete={
                                handleDeleteAccount
                            }
                        />
                    </Box>

                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <ProfileForm
                            formData={
                                formData
                            }
                            updating={
                                updating
                            }
                            validationErrors={
                                validationErrors
                            }
                            onChange={
                                handleChange
                            }
                            onSubmit={
                                handleSubmit
                            }
                        />
                    </Box>
                </Box>
            )}

            {/* =================================================
                CHANGE PASSWORD
            ================================================= */}

            <ChangePasswordDialog
                open={
                    passwordDialogOpen
                }
                onClose={() =>
                    setPasswordDialogOpen(
                        false
                    )
                }
            />

            {/* =================================================
                SUCCESS SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    snackbarOpen
                }
                autoHideDuration={
                    3000
                }
                onClose={
                    handleSnackbarClose
                }
                anchorOrigin={{
                    vertical:
                        "bottom",
                    horizontal:
                        "right",
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={
                        handleSnackbarClose
                    }
                >
                    {message ||
                        "Profile updated successfully."}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;