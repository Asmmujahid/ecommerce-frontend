import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import inventoryService from "../../Services/admin/inventoryService";


// ===============================
// GET ALL INVENTORIES
// ===============================
export const getInventories = createAsyncThunk(
    "inventory/getInventories",
    async (_, { rejectWithValue }) => {

        try {

            const response = await inventoryService.getInventories();

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch inventories"
            );
        }
    }
);


// ===============================
// GET SINGLE INVENTORY
// ===============================
export const getInventory = createAsyncThunk(
    "inventory/getInventory",
    async (id, { rejectWithValue }) => {

        try {

            const response =
                await inventoryService.getInventory(id);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch inventory"
            );
        }
    }
);


// ===============================
// CREATE INVENTORY
// ===============================
export const createInventory = createAsyncThunk(
    "inventory/createInventory",
    async (data, { rejectWithValue }) => {

        try {

            const response =
                await inventoryService.createInventory(data);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create inventory"
            );
        }
    }
);


// ===============================
// UPDATE INVENTORY
// ===============================
export const updateInventory = createAsyncThunk(
    "inventory/updateInventory",
    async ({ id, data }, { rejectWithValue }) => {

        try {

            const response =
                await inventoryService.updateInventory(
                    id,
                    data
                );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update inventory"
            );
        }
    }
);


// ===============================
// DELETE INVENTORY
// ===============================
export const deleteInventory = createAsyncThunk(
    "inventory/deleteInventory",
    async (id, { rejectWithValue }) => {

        try {

            await inventoryService.deleteInventory(id);

            return id;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete inventory"
            );
        }
    }
);



// ===============================
// INITIAL STATE
// ===============================
const initialState = {

    inventories: [],

    inventory: null,

    loading: false,

    success: false,

    error: null,

};



// ===============================
// SLICE
// ===============================
const inventorySlice = createSlice({

    name: "inventory",

    initialState,


    reducers: {


        clearInventoryError: (state) => {

            state.error = null;

        },


        clearInventorySuccess: (state) => {

            state.success = false;

        },


        resetInventory: (state) => {

            state.inventory = null;

        }

    },


    extraReducers: (builder) => {


        builder


        // ===============================
        // GET ALL
        // ===============================
        .addCase(getInventories.pending, (state)=>{

            state.loading = true;

        })


        .addCase(getInventories.fulfilled, (state, action)=>{

            state.loading = false;

            state.inventories = action.payload;

        })


        .addCase(getInventories.rejected, (state, action)=>{

            state.loading = false;

            state.error = action.payload;

        })



        // ===============================
        // GET SINGLE
        // ===============================
        .addCase(getInventory.pending, (state)=>{

            state.loading = true;

        })


        .addCase(getInventory.fulfilled, (state, action)=>{

            state.loading = false;

            state.inventory = action.payload;

        })


        .addCase(getInventory.rejected, (state, action)=>{

            state.loading = false;

            state.error = action.payload;

        })



        // ===============================
        // CREATE
        // ===============================
        .addCase(createInventory.pending,(state)=>{

            state.loading = true;

        })


        .addCase(createInventory.fulfilled,(state, action)=>{

            state.loading = false;

            state.success = true;


            state.inventories.unshift(
                action.payload
            );

        })


        .addCase(createInventory.rejected,(state, action)=>{

            state.loading = false;

            state.error = action.payload;

        })



        // ===============================
        // UPDATE
        // ===============================
        .addCase(updateInventory.pending,(state)=>{

            state.loading = true;

        })


        .addCase(updateInventory.fulfilled,(state, action)=>{

            state.loading = false;

            state.success = true;


            const index =
                state.inventories.findIndex(
                    item => item.id === action.payload.id
                );


            if(index !== -1){

                state.inventories[index] =
                    action.payload;

            }

        })


        .addCase(updateInventory.rejected,(state, action)=>{

            state.loading = false;

            state.error = action.payload;

        })



        // ===============================
        // DELETE
        // ===============================
        .addCase(deleteInventory.pending,(state)=>{

            state.loading = true;

        })


        .addCase(deleteInventory.fulfilled,(state, action)=>{

            state.loading = false;

            state.success = true;


            state.inventories =
                state.inventories.filter(
                    item => item.id !== action.payload
                );

        })


        .addCase(deleteInventory.rejected,(state, action)=>{

            state.loading = false;

            state.error = action.payload;

        });


    }

});



export const {
    clearInventoryError,
    clearInventorySuccess,
    resetInventory

} = inventorySlice.actions;



export default inventorySlice.reducer;