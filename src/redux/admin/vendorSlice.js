import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "../../Services/admin/vendorService";

// ==========================================
// Get All Vendors
// ==========================================
export const getVendors = createAsyncThunk(
    "adminVendor/getVendors",
    async (_, thunkAPI) => {
        try {
            return await vendorService.getVendors();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch vendors"
            );
        }
    }
);

// ==========================================
// Get Single Vendor
// ==========================================
export const getVendor = createAsyncThunk(
    "adminVendor/getVendor",
    async (id, thunkAPI) => {
        try {
            return await vendorService.getVendor(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch vendor"
            );
        }
    }
);

// ==========================================
// Update Vendor
// ==========================================
export const updateVendor = createAsyncThunk(
    "adminVendor/updateVendor",
    async ({ id, vendorData }, thunkAPI) => {
        try {
            return await vendorService.updateVendor({
                id,
                vendorData,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to update vendor"
            );
        }
    }
);

// ==========================================
// Delete Vendor
// ==========================================
export const deleteVendor = createAsyncThunk(
    "adminVendor/deleteVendor",
    async (id, thunkAPI) => {
        try {
            await vendorService.deleteVendor(id);

            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to delete vendor"
            );
        }
    }
);

const initialState = {
    vendors: [],
    vendor: null,

    loading: false,
    success: false,
    error: null,
};

const vendorSlice = createSlice({
    name: "adminVendor",

    initialState,

    reducers: {
        clearVendor: (state) => {
            state.vendor = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // Get Vendors
            // ==========================================

            .addCase(getVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getVendors.fulfilled, (state, action) => {
                state.loading = false;

                state.vendors = action.payload.data;
            })

            .addCase(getVendors.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })

            // ==========================================
            // Get Vendor
            // ==========================================

            .addCase(getVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getVendor.fulfilled, (state, action) => {
                state.loading = false;

                state.vendor = action.payload.data;
            })

            .addCase(getVendor.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })

            // ==========================================
            // Update Vendor
            // ==========================================

            .addCase(updateVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateVendor.fulfilled, (state, action) => {
                state.loading = false;

                state.success = true;

                state.vendor = action.payload.data;

                state.vendors = state.vendors.map((vendor) =>
                    vendor.id === action.payload.data.id
                        ? action.payload.data
                        : vendor
                );
            })

            .addCase(updateVendor.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })

            // ==========================================
            // Delete Vendor
            // ==========================================

            .addCase(deleteVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteVendor.fulfilled, (state, action) => {
                state.loading = false;

                state.success = true;

                state.vendors = state.vendors.filter(
                    (vendor) => vendor.id !== action.payload
                );
            })

            .addCase(deleteVendor.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            });
    },
});

export const { clearVendor } = vendorSlice.actions;

export default vendorSlice.reducer;