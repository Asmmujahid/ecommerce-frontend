import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerCustomerService from "../../Services/seller/sellerCustomerService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  customers: [],
  customer: null,

  loading: false,
  success: false,
  error: null,
};

/*
|--------------------------------------------------------------------------
| Get All Customers
|--------------------------------------------------------------------------
*/

export const getCustomers = createAsyncThunk(
  "sellerCustomer/getCustomers",
  async (_, thunkAPI) => {
    try {
      return await sellerCustomerService.getCustomers();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load customers"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Get Single Customer
|--------------------------------------------------------------------------
*/

export const getCustomer = createAsyncThunk(
  "sellerCustomer/getCustomer",
  async (id, thunkAPI) => {
    try {
      return await sellerCustomerService.getCustomer(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load customer"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerCustomerSlice = createSlice({
  name: "sellerCustomer",
  initialState,

  reducers: {
    resetSellerCustomerState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },

    clearCustomer: (state) => {
      state.customer = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | Get Customers
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.customers = action.payload.data || [];
      })

      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      /*
      |--------------------------------------------------------------------------
      | Get Customer
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.customer = action.payload.data;
      })

      .addCase(getCustomer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export const {
  resetSellerCustomerState,
  clearCustomer,
} = sellerCustomerSlice.actions;

export default sellerCustomerSlice.reducer;