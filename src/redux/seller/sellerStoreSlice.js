import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerStoreService from "../../Services/seller/sellerStoreService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    store: null,

    loading: false,
    updateLoading: false,

    success: false,
    error: null,

    message: "",
};

/*
|--------------------------------------------------------------------------
| Async Thunks
|--------------------------------------------------------------------------
*/

/**
 * Get Store Details
 * GET /seller/store
 */
export const getStore = createAsyncThunk(
    "sellerStore/getStore",
    async (_, thunkAPI) => {
        try {
            return await sellerStoreService.getStore();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message ||
                error.error ||
                "Failed to fetch store."
            );
        }
    }
);

/**
 * Update Store
 * PUT /seller/store
 */
export const updateStore = createAsyncThunk(
    "sellerStore/updateStore",
    async (storeData, thunkAPI) => {
        try {
            return await sellerStoreService.updateStore(storeData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message ||
                error.error ||
                "Failed to update store."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerStoreSlice = createSlice({
    name: "sellerStore",

    initialState,

    reducers: {
        clearStoreError(state) {
            state.error = null;
        },

        clearStoreMessage(state) {
            state.message = "";
        },

        resetStoreState(state) {
            state.success = false;
            state.error = null;
            state.message = "";
        },
    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | Get Store
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getStore.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.store = action.payload.data;
                state.message = action.payload.message;
            })

            .addCase(getStore.rejected, (state, action) => {
                state.loading = false;

                state.success = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | Update Store
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(updateStore.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(updateStore.fulfilled, (state, action) => {
                state.updateLoading = false;

                state.success = true;

                state.store = action.payload.data;
                state.message = action.payload.message;
            })

            .addCase(updateStore.rejected, (state, action) => {
                state.updateLoading = false;

                state.success = false;
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
    clearStoreError,
    clearStoreMessage,
    resetStoreState,
} = sellerStoreSlice.actions;

/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default sellerStoreSlice.reducer;