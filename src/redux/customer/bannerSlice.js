
// src/redux/customer/bannerSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getBanners,
} from "../../Services/customer/bannerService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    banners: [],
    loading: false,
    error: null,
};

// =====================================================
// FETCH BANNERS
//
// GET /api/banners
//
// Expected Laravel response:
//
// {
//     success: true,
//     message: "...",
//     data: []
// }
// =====================================================

export const fetchBanners = createAsyncThunk(
    "customerBanner/fetchBanners",

    async (_, thunkAPI) => {
        try {
            const response = await getBanners();

            /*
             * bannerService returns:
             *
             * response.data
             *
             * Which should be:
             *
             * {
             *     success: true,
             *     message: "...",
             *     data: [...]
             * }
             */

            const payload = response?.data;

            if (Array.isArray(payload)) {
                return payload;
            }

            return [];
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch banners."
            );
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const bannerSlice = createSlice({
    name: "customerBanner",

    initialState,

    reducers: {
        // =================================================
        // CLEAR BANNERS
        // =================================================

        clearBanners: (state) => {
            state.banners = [];
            state.error = null;
        },

        // =================================================
        // CLEAR ERROR
        // =================================================

        clearBannerError: (state) => {
            state.error = null;
        },

        // =================================================
        // RESET STATE
        // =================================================

        resetBannerState: () => {
            return {
                ...initialState,
                banners: [],
            };
        },
    },

    extraReducers: (builder) => {
        // =================================================
        // FETCH BANNERS - PENDING
        // =================================================

        builder.addCase(
            fetchBanners.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        // =================================================
        // FETCH BANNERS - FULFILLED
        // =================================================

        builder.addCase(
            fetchBanners.fulfilled,
            (state, action) => {
                state.loading = false;

                state.banners = Array.isArray(
                    action.payload
                )
                    ? action.payload
                    : [];

                state.error = null;
            }
        );

        // =================================================
        // FETCH BANNERS - REJECTED
        // =================================================

        builder.addCase(
            fetchBanners.rejected,
            (state, action) => {
                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to fetch banners.";

                state.banners = [];
            }
        );
    },
});

// =====================================================
// SELECTORS
// =====================================================

export const selectBanners = (state) =>
    state.customerBanner?.banners ?? [];

export const selectBannerLoading = (state) =>
    state.customerBanner?.loading ?? false;

export const selectBannerError = (state) =>
    state.customerBanner?.error ?? null;

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearBanners,
    clearBannerError,
    resetBannerState,
} = bannerSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default bannerSlice.reducer;

