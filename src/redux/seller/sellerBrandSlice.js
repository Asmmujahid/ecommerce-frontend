import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sellerBrandService from "../../services/seller/sellerBrandService";

const initialState = {
    brands: [],
    brand: null,

    loading: false,
    success: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| Get Brands
|--------------------------------------------------------------------------
*/

export const getSellerBrands = createAsyncThunk(
    "sellerBrands/getSellerBrands",
    async (_, thunkAPI) => {
        try {
            return await sellerBrandService.getSellerBrands();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Unable to fetch brands."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Get Brand
|--------------------------------------------------------------------------
*/

export const getSellerBrand = createAsyncThunk(
    "sellerBrands/getSellerBrand",
    async (id, thunkAPI) => {
        try {
           return await sellerBrandService.getSellerBrand(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Unable to fetch brand."
            );
        }
    }
);

const sellerBrandSlice = createSlice({
    name: "sellerBrands",

    initialState,

    reducers: {
        resetSellerBrandState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.brand = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(getSellerBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSellerBrands.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.brands = action.payload.data;
})

            .addCase(getSellerBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getSellerBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSellerBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.brand = action.payload.data;
            })

            .addCase(getSellerBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetSellerBrandState } =
    sellerBrandSlice.actions;

export default sellerBrandSlice.reducer;