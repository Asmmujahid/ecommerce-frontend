import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sellerCategoryService from "../../services/seller/sellerCategoryService";

const initialState = {
    categories: [],
    category: null,

    loading: false,
    success: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| Get Categories
|--------------------------------------------------------------------------
*/

export const getSellerCategories = createAsyncThunk(
    "sellerCategories/getSellerCategories",
    async (_, thunkAPI) => {
        try {
           return await sellerCategoryService.getSellerCategories();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Unable to fetch categories."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Get Category
|--------------------------------------------------------------------------
*/

export const getSellerCategory = createAsyncThunk(
    "sellerCategories/getSellerCategory",
    async (id, thunkAPI) => {
        try {
           return await sellerCategoryService.getSellerCategory(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Unable to fetch category."
            );
        }
    }
);

const sellerCategorySlice = createSlice({
    name: "sellerCategories",

    initialState,

    reducers: {
        resetSellerCategoryState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.category = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(getSellerCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSellerCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories = action.payload.data;
            })

            .addCase(getSellerCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getSellerCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSellerCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.category = action.payload.data;
            })

            .addCase(getSellerCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetSellerCategoryState } =
    sellerCategorySlice.actions;

export default sellerCategorySlice.reducer;