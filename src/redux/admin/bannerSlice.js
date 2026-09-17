import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerService from "../../Services/admin/bannerService";

// ===============================
// Get All Banners
// ===============================
export const getBanners = createAsyncThunk(
    "adminBanner/getBanners",
    async (_, thunkAPI) => {
        try {
            return await bannerService.getBanners();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch banners"
            );
        }
    }
);

// ===============================
// Get Single Banner
// ===============================
export const getBanner = createAsyncThunk(
    "adminBanner/getBanner",
    async (id, thunkAPI) => {
        try {
            return await bannerService.getBanner(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch banner"
            );
        }
    }
);

// ===============================
// Create Banner
// ===============================
export const createBanner = createAsyncThunk(
    "adminBanner/createBanner",
    async (bannerData, thunkAPI) => {
        try {
            return await bannerService.createBanner(bannerData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create banner"
            );
        }
    }
);

// ===============================
// Update Banner
// ===============================
export const updateBanner = createAsyncThunk(
    "adminBanner/updateBanner",
    async ({ id, bannerData }, thunkAPI) => {
        try {
            return await bannerService.updateBanner(id, bannerData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update banner"
            );
        }
    }
);

// ===============================
// Delete Banner
// ===============================
export const deleteBanner = createAsyncThunk(
    "adminBanner/deleteBanner",
    async (id, thunkAPI) => {
        try {
            await bannerService.deleteBanner(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete banner"
            );
        }
    }
);

// ===============================
// Initial State
// ===============================
const initialState = {
    banners: [],
    banner: null,
    loading: false,
    error: null,
    successMessage: null,
};

// ===============================
// Slice
// ===============================
const bannerSlice = createSlice({
    name: "adminBanner",
    initialState,

    reducers: {
        clearBannerError: (state) => {
            state.error = null;
        },

        clearBannerMessage: (state) => {
            state.successMessage = null;
        },

        clearCurrentBanner: (state) => {
            state.banner = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ===============================
            // Get All Banners
            // ===============================
            .addCase(getBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload.banners || [];
            })

            .addCase(getBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===============================
            // Get Single Banner
            // ===============================
            .addCase(getBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banner = action.payload.banner;
            })

            .addCase(getBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===============================
            // Create Banner
            // ===============================
            .addCase(createBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createBanner.fulfilled, (state, action) => {
                state.loading = false;

                state.banners.unshift(action.payload.banner);

                state.successMessage =
                    action.payload.message ||
                    "Banner created successfully";
            })

            .addCase(createBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===============================
            // Update Banner
            // ===============================
            .addCase(updateBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false;

                const updatedBanner = action.payload.banner;

                state.banners = state.banners.map((banner) =>
                    banner.id === updatedBanner.id
                        ? updatedBanner
                        : banner
                );

                state.banner = updatedBanner;

                state.successMessage =
                    action.payload.message ||
                    "Banner updated successfully";
            })

            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===============================
            // Delete Banner
            // ===============================
            .addCase(deleteBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;

                state.banners = state.banners.filter(
                    (banner) => banner.id !== action.payload
                );

                state.successMessage = "Banner deleted successfully";
            })

            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearBannerError,
    clearBannerMessage,
    clearCurrentBanner,
} = bannerSlice.actions;

export default bannerSlice.reducer;