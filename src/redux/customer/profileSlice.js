// src/redux/customer/profileSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import ProfileService from "../../Services/customer/profileService";

import { updateUser } from "../authSlice";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    profile: null,

    loading: false,

    updating: false,

    changingPassword: false,

    deleting: false,

    success: false,

    message: "",

    error: null,

    validationErrors: {},
};

// =====================================================
// GET CUSTOMER PROFILE
// =====================================================

export const getCustomerProfile =
    createAsyncThunk(
        "customerProfile/getCustomerProfile",

        async (_, thunkAPI) => {
            try {
                const response =
                    await ProfileService.getProfile();

                console.log(
                    "getCustomerProfile:",
                    response
                );

                /*
                 * Profile API response:
                 *
                 * {
                 *     success: true,
                 *     message: "...",
                 *     data: {
                 *         id: 1,
                 *         name: "...",
                 *         email: "...",
                 *         avatar: "http://127.0.0.1:8000/storage/avatars/..."
                 *     }
                 * }
                 */

                const profile =
                    response?.data || null;

                /*
                 * IMPORTANT
                 *
                 * Keep auth.user synchronized with
                 * the latest profile.
                 *
                 * Navbar reads auth.user.
                 */
                if (profile) {
                    thunkAPI.dispatch(
                        updateUser(profile)
                    );
                }

                return response;
            } catch (error) {
                console.error(
                    "getCustomerProfile error:",
                    error
                );

                return thunkAPI.rejectWithValue({
                    message:
                        error?.message ||
                        "Customer profile could not be loaded.",

                    errors:
                        error?.errors ||
                        {},

                    status:
                        error?.status ||
                        null,
                });
            }
        }
    );

// =====================================================
// UPDATE CUSTOMER PROFILE
// =====================================================

export const updateCustomerProfile =
    createAsyncThunk(
        "customerProfile/updateCustomerProfile",

        async (
            profileData,
            thunkAPI
        ) => {
            try {
                const response =
                    await ProfileService.updateProfile(
                        profileData
                    );

                console.log(
                    "updateCustomerProfile:",
                    response
                );

                const updatedProfile =
                    response?.data || null;

                /*
                 * IMPORTANT
                 *
                 * Update auth.user immediately
                 * after profile update.
                 *
                 * This is especially important for
                 * the avatar displayed in Navbar.
                 */
                if (updatedProfile) {
                    thunkAPI.dispatch(
                        updateUser(
                            updatedProfile
                        )
                    );
                }

                return response;
            } catch (error) {
                console.error(
                    "updateCustomerProfile error:",
                    error
                );

                return thunkAPI.rejectWithValue({
                    message:
                        error?.message ||
                        "Failed to update profile.",

                    errors:
                        error?.errors ||
                        {},

                    status:
                        error?.status ||
                        null,
                });
            }
        }
    );

// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changeCustomerPassword =
    createAsyncThunk(
        "customerProfile/changeCustomerPassword",

        async (
            passwordData,
            thunkAPI
        ) => {
            try {
                const response =
                    await ProfileService.changePassword(
                        passwordData
                    );

                return response;
            } catch (error) {
                console.error(
                    "changeCustomerPassword error:",
                    error
                );

                return thunkAPI.rejectWithValue({
                    message:
                        error?.message ||
                        "Failed to change password.",

                    errors:
                        error?.errors ||
                        {},

                    status:
                        error?.status ||
                        null,
                });
            }
        }
    );

// =====================================================
// DELETE CUSTOMER ACCOUNT
// =====================================================

export const deleteCustomerAccount =
    createAsyncThunk(
        "customerProfile/deleteCustomerAccount",

        async (_, thunkAPI) => {
            try {
                const response =
                    await ProfileService.deleteAccount();

                return response;
            } catch (error) {
                console.error(
                    "deleteCustomerAccount error:",
                    error
                );

                return thunkAPI.rejectWithValue({
                    message:
                        error?.message ||
                        "Failed to delete account.",

                    errors:
                        error?.errors ||
                        {},

                    status:
                        error?.status ||
                        null,
                });
            }
        }
    );

// =====================================================
// SLICE
// =====================================================

const customerProfileSlice =
    createSlice({
        name: "customerProfile",

        initialState,

        reducers: {
            // =================================================
            // CLEAR ERROR
            // =================================================

            clearProfileError: (
                state
            ) => {
                state.error = null;

                state.validationErrors =
                    {};
            },

            // =================================================
            // CLEAR MESSAGE
            // =================================================

            clearProfileMessage: (
                state
            ) => {
                state.message = "";

                state.success = false;
            },

            // =================================================
            // CLEAR PROFILE
            // =================================================

            clearCustomerProfile: (
                state
            ) => {
                state.profile = null;
            },

            // =================================================
            // RESET STATE
            // =================================================

            resetCustomerProfileState:
                () => ({
                    ...initialState,
                }),
        },

        extraReducers: (
            builder
        ) => {
            // =================================================
            // GET PROFILE
            // =================================================

            builder

                .addCase(
                    getCustomerProfile.pending,
                    (state) => {
                        state.loading = true;

                        state.error = null;

                        state.validationErrors =
                            {};
                    }
                )

                .addCase(
                    getCustomerProfile.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        const profile =
                            action.payload
                                ?.data ||
                            null;

                        state.profile =
                            profile;

                        state.error = null;

                        state.validationErrors =
                            {};
                    }
                )

                .addCase(
                    getCustomerProfile.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        state.error =
                            action.payload
                                ?.message ||
                            "Customer profile could not be loaded.";

                        state.validationErrors =
                            action.payload
                                ?.errors ||
                            {};
                    }
                )

                // =================================================
                // UPDATE PROFILE
                // =================================================

                .addCase(
                    updateCustomerProfile.pending,
                    (state) => {
                        state.updating =
                            true;

                        state.success =
                            false;

                        state.message =
                            "";

                        state.error =
                            null;

                        state.validationErrors =
                            {};
                    }
                )

                .addCase(
                    updateCustomerProfile.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.updating =
                            false;

                        state.success =
                            true;

                        const updatedProfile =
                            action.payload
                                ?.data ||
                            state.profile;

                        state.profile =
                            updatedProfile;

                        state.message =
                            action.payload
                                ?.message ||
                            "Profile updated successfully.";

                        state.error =
                            null;

                        state.validationErrors =
                            {};
                    }
                )

                .addCase(
                    updateCustomerProfile.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.updating =
                            false;

                        state.success =
                            false;

                        state.error =
                            action.payload
                                ?.message ||
                            "Failed to update profile.";

                        state.validationErrors =
                            action.payload
                                ?.errors ||
                            {};
                    }
                )

                // =================================================
                // CHANGE PASSWORD
                // =================================================

                .addCase(
                    changeCustomerPassword.pending,
                    (state) => {
                        state.changingPassword =
                            true;

                        state.success =
                            false;

                        state.message =
                            "";

                        state.error =
                            null;

                        state.validationErrors =
                            {};
                    }
                )

                .addCase(
                    changeCustomerPassword.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.changingPassword =
                            false;

                        state.success =
                            true;

                        state.message =
                            action.payload
                                ?.message ||
                            "Password changed successfully.";

                        state.error =
                            null;

                        state.validationErrors =
                            {};
                    }
                )

                .addCase(
                    changeCustomerPassword.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.changingPassword =
                            false;

                        state.success =
                            false;

                        state.error =
                            action.payload
                                ?.message ||
                            "Failed to change password.";

                        state.validationErrors =
                            action.payload
                                ?.errors ||
                            {};
                    }
                )

                // =================================================
                // DELETE ACCOUNT
                // =================================================

                .addCase(
                    deleteCustomerAccount.pending,
                    (state) => {
                        state.deleting =
                            true;

                        state.success =
                            false;

                        state.message =
                            "";

                        state.error =
                            null;
                    }
                )

                .addCase(
                    deleteCustomerAccount.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.deleting =
                            false;

                        state.success =
                            true;

                        state.profile =
                            null;

                        state.message =
                            action.payload
                                ?.message ||
                            "Account deleted successfully.";

                        state.error =
                            null;
                    }
                )

                .addCase(
                    deleteCustomerAccount.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.deleting =
                            false;

                        state.success =
                            false;

                        state.error =
                            action.payload
                                ?.message ||
                            "Failed to delete account.";
                    }
                );
        },
    });

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearProfileError,
    clearProfileMessage,
    clearCustomerProfile,
    resetCustomerProfileState,
} =
    customerProfileSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectCustomerProfile = (
    state
) =>
    state.customerProfile?.profile ||
    null;

export const selectCustomerProfileLoading = (
    state
) =>
    state.customerProfile?.loading ||
    false;

export const selectCustomerProfileUpdating = (
    state
) =>
    state.customerProfile?.updating ||
    false;

export const selectCustomerProfileError = (
    state
) =>
    state.customerProfile?.error ||
    null;

export const selectCustomerProfileSuccess = (
    state
) =>
    state.customerProfile?.success ||
    false;

export const selectCustomerProfileMessage = (
    state
) =>
    state.customerProfile?.message ||
    "";

// =====================================================
// EXPORT
// =====================================================

export default customerProfileSlice.reducer;