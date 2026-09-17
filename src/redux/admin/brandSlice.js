import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import brandService from "../../Services/admin/brandService";

// =========================================
// Get All Brands
// =========================================
export const getBrands = createAsyncThunk(
    "adminBrand/getBrands",
    async (_, thunkAPI) => {
        try {
            return await brandService.getBrands();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch brands"
            );
        }
    }
);

// =========================================
// Get Single Brand
// =========================================
export const getBrand = createAsyncThunk(
    "adminBrand/getBrand",
    async (id, thunkAPI) => {
        try {
            return await brandService.getBrand(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch brand"
            );
        }
    }
);

// =========================================
// Create Brand
// =========================================
export const createBrand = createAsyncThunk(
    "adminBrand/createBrand",
    async (brandData, thunkAPI) => {
        try {
            return await brandService.createBrand(brandData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create brand"
            );
        }
    }
);

// =========================================
// Update Brand
// =========================================
export const updateBrand = createAsyncThunk(
    "adminBrand/updateBrand",
    async ({ id, brandData }, thunkAPI) => {
        try {
            return await brandService.updateBrand({
                id,
                brandData,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update brand"
            );
        }
    }
);

// =========================================
// Delete Brand
// =========================================
export const deleteBrand = createAsyncThunk(
    "adminBrand/deleteBrand",
    async (id, thunkAPI) => {
        try {
            await brandService.deleteBrand(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete brand"
            );
        }
    }
);

// =========================================
// Initial State
// =========================================
const initialState = {
    brands: [],
    brand: null,

    loading: false,
    success: false,
    error: null,
};

// =========================================
// Slice
// =========================================
const brandSlice = createSlice({
    name: "adminBrand",
    initialState,

    reducers: {
        resetBrandState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.brand = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // =========================================
            // Get Brands
            // =========================================
            .addCase(getBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getBrands.fulfilled, (state, action) => {
                state.loading = false;
                // state.success = true;
                state.brands = action.payload.brands;
            })

            .addCase(getBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================================
            // Get Brand
            // =========================================
            .addCase(getBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getBrand.fulfilled, (state, action) => {
                state.loading = false;
                // state.success = true;
                state.brand = action.payload.brand;
            })

            .addCase(getBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================================
            // Create Brand
            // =========================================
            .addCase(createBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.brands.unshift(action.payload.brand);
            })

            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================================
            // Update Brand
            // =========================================
            .addCase(updateBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.brands = state.brands.map((brand) =>
                    brand.id === action.payload.brand.id
                        ? action.payload.brand
                        : brand
                );

                state.brand = action.payload.brand;
            })

            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================================
            // Delete Brand
            // =========================================
            .addCase(deleteBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.brands = state.brands.filter(
                    (brand) => brand.id !== action.payload
                );
            })

            .addCase(deleteBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBrandState } = brandSlice.actions;

export default brandSlice.reducer;