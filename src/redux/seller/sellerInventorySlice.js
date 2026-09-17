import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerInventoryService from "../../Services/seller/sellerInventoryService";


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    inventories: [],
    inventory: null,

    loading: false,
    success: false,
    error: false,
    message: "",
};

/*
|--------------------------------------------------------------------------
| Get All Inventories
|--------------------------------------------------------------------------
*/

export const getSellerInventories = createAsyncThunk(
    "sellerInventory/getAll",
    async (_, thunkAPI) => {
        try {
            return await sellerInventoryService.getInventories();
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

/*
|--------------------------------------------------------------------------
| Get Single Inventory
|--------------------------------------------------------------------------
*/

export const getSellerInventory = createAsyncThunk(
    "sellerInventory/getOne",
    async (id, thunkAPI) => {
        try {
            return await sellerInventoryService.getInventory(id);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

/*
|--------------------------------------------------------------------------
| Create Inventory
|--------------------------------------------------------------------------
*/

export const createSellerInventory = createAsyncThunk(
    "sellerInventory/create",
    async (data, thunkAPI) => {
        try {
            return await sellerInventoryService.createInventory(data);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

/*
|--------------------------------------------------------------------------
| Update Inventory
|--------------------------------------------------------------------------
*/

export const updateSellerInventory = createAsyncThunk(
    "sellerInventory/update",
    async ({ id, data }, thunkAPI) => {
        try {
            return await sellerInventoryService.updateInventory(id, data);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

/*
|--------------------------------------------------------------------------
| Delete Inventory
|--------------------------------------------------------------------------
*/

export const deleteSellerInventory = createAsyncThunk(
    "sellerInventory/delete",
    async (id, thunkAPI) => {
        try {
            await sellerInventoryService.deleteInventory(id);
            return id;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerInventorySlice = createSlice({
    name: "sellerInventory",

    initialState,

    reducers: {
        resetSellerInventoryState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = false;
            state.message = "";
        },

        clearSellerInventory: (state) => {
            state.inventory = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | Get All Inventories
            |--------------------------------------------------------------------------
            */

            .addCase(getSellerInventories.pending, (state) => {
                state.loading = true;
            })

            .addCase(getSellerInventories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.inventories = action.payload.data;
            })

            .addCase(getSellerInventories.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | Get Single Inventory
            |--------------------------------------------------------------------------
            */

            .addCase(getSellerInventory.pending, (state) => {
                state.loading = true;
            })

            .addCase(getSellerInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.inventory = action.payload.data;
            })

            .addCase(getSellerInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | Create Inventory
            |--------------------------------------------------------------------------
            */

            .addCase(createSellerInventory.pending, (state) => {
                state.loading = true;
            })

            .addCase(createSellerInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.inventories.unshift(action.payload.data);
            })

            .addCase(createSellerInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | Update Inventory
            |--------------------------------------------------------------------------
            */

            .addCase(updateSellerInventory.pending, (state) => {
                state.loading = true;
            })

            .addCase(updateSellerInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.inventory = action.payload.data;

                state.inventories = state.inventories.map((inventory) =>
                    inventory.id === action.payload.data.id
                        ? action.payload.data
                        : inventory
                );
            })

            .addCase(updateSellerInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | Delete Inventory
            |--------------------------------------------------------------------------
            */

            .addCase(deleteSellerInventory.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteSellerInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.inventories = state.inventories.filter(
                    (inventory) => inventory.id !== action.payload
                );
            })

            .addCase(deleteSellerInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            });
    },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    resetSellerInventoryState,
    clearSellerInventory,
} = sellerInventorySlice.actions;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default sellerInventorySlice.reducer;