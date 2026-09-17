import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import profileService from "../../Services/admin/profileService";

// ======================================================
// Get Admin Profile
// ======================================================
export const getProfile = createAsyncThunk(
    "adminProfile/getProfile",
    async (_, thunkAPI) => {
        try {
            return await profileService.getProfile();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch profile"
            );
        }
    }
);

// ======================================================
// Update Admin Profile
// ======================================================
export const updateProfile = createAsyncThunk(
    "adminProfile/updateProfile",
    async (profileData, thunkAPI) => {
        try {
            return await profileService.updateProfile(
                profileData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to update profile"
            );
        }
    }
);

// ======================================================
// Change Password
// ======================================================
export const changePassword = createAsyncThunk(
    "adminProfile/changePassword",
    async (passwordData, thunkAPI) => {
        try {
            return await profileService.changePassword(
                passwordData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to change password"
            );
        }
    }
);

// ======================================================
// Initial State
// ======================================================
const initialState = {
    profile: null,

    loading: false,

    error: null,

    successMessage: null,
};

// ======================================================
// Slice
// ======================================================
const profileSlice = createSlice({
    name: "adminProfile",

    initialState,

    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },

        clearProfileMessage: (state) => {
            state.successMessage = null;
        },

        clearCurrentProfile: (state) => {
            state.profile = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ======================================
            // Get Profile
            // ======================================
            .addCase(
                getProfile.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getProfile.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.profile =
                        action.payload.data;

                    state.successMessage =
                        action.payload.message ||
                        "Profile loaded successfully";
                }
            )

            .addCase(
                getProfile.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            )

            // ======================================
            // Update Profile
            // ======================================
            .addCase(
                updateProfile.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateProfile.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.profile =
                        action.payload.data;

                    state.successMessage =
                        action.payload.message ||
                        "Profile updated successfully";
                }
            )

            .addCase(
                updateProfile.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            )

            // ======================================
            // Change Password
            // ======================================
            .addCase(
                changePassword.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                changePassword.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.successMessage =
                        action.payload.message ||
                        "Password changed successfully";
                }
            )

            .addCase(
                changePassword.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearProfileError,
    clearProfileMessage,
    clearCurrentProfile,
} = profileSlice.actions;

export default profileSlice.reducer;