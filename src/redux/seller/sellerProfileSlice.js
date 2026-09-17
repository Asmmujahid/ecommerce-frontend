import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerProfileService from "../../Services/seller/sellerProfileService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    profile: null,

    loading: false,
    updateLoading: false,
    passwordLoading: false,

    success: false,
    error: null,

    message: null,
};

/*
|--------------------------------------------------------------------------
| Get Seller Profile
|--------------------------------------------------------------------------
*/

export const getSellerProfile = createAsyncThunk(
    "sellerProfile/getSellerProfile",
    async (_, thunkAPI) => {
        try {
            return await sellerProfileService.getProfile();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message ||
                error.errors ||
                "Failed to load profile."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Update Seller Profile
|--------------------------------------------------------------------------
*/

export const updateSellerProfile = createAsyncThunk(
    "sellerProfile/updateSellerProfile",
    async (profileData, thunkAPI) => {
        try {
            return await sellerProfileService.updateProfile(profileData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message ||
                error.errors ||
                "Failed to update profile."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changeSellerPassword = createAsyncThunk(
    "sellerProfile/changeSellerPassword",
    async (passwordData, thunkAPI) => {
        try {
            return await sellerProfileService.changePassword(passwordData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message ||
                error.errors ||
                "Failed to change password."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerProfileSlice = createSlice({
    name: "sellerProfile",

    initialState,

    reducers: {
        clearSellerProfileError: (state) => {
            state.error = null;
        },

        clearSellerProfileMessage: (state) => {
            state.message = null;
            state.success = false;
        },

        resetSellerProfileState: () => initialState,
    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | Get Profile
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getSellerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSellerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.profile =
                    action.payload.data ?? action.payload;

                state.message =
                    action.payload.message ??
                    "Profile loaded successfully.";
            })

            .addCase(getSellerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | Update Profile
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(updateSellerProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(updateSellerProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.success = true;

                state.profile =
                    action.payload.data ?? action.payload;

                state.message =
                    action.payload.message ??
                    "Profile updated successfully.";
            })

            .addCase(updateSellerProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | Change Password
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(changeSellerPassword.pending, (state) => {
                state.passwordLoading = true;
                state.error = null;
            })

            .addCase(changeSellerPassword.fulfilled, (state, action) => {
                state.passwordLoading = false;
                state.success = true;

                state.message =
                    action.payload.message ??
                    "Password changed successfully.";
            })

            .addCase(changeSellerPassword.rejected, (state, action) => {
                state.passwordLoading = false;
                state.error = action.payload;
            });
    },
});

/*
|--------------------------------------------------------------------------
| Export Actions
|--------------------------------------------------------------------------
*/

export const {
    clearSellerProfileError,
    clearSellerProfileMessage,
    resetSellerProfileState,
} = sellerProfileSlice.actions;

/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default sellerProfileSlice.reducer;