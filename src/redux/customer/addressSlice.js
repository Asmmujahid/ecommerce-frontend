import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import addressService from "../../Services/customer/addressService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    addresses: [],
    address: null,

    loading: false,
    creating: false,
    updating: false,
    deleting: false,

    success: false,
    message: null,
    error: null,

    validationErrors: {},

    createSuccess: false,
    createMessage: null,
    createError: null,

    updateSuccess: false,
    updateMessage: null,
    updateError: null,

    deleteSuccess: false,
    deleteMessage: null,
    deleteError: null,
};

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorPayload = (error) => {
    const responseData = error?.response?.data;

    return {
        message:
            responseData?.message ??
            error?.message ??
            "Something went wrong.",

        errors:
            responseData?.errors ??
            {},
    };
};

// =====================================================
// FETCH ALL ADDRESSES
// GET /api/customer/addresses
// =====================================================

export const fetchAddresses = createAsyncThunk(
    "customerAddress/fetchAddresses",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await addressService.getAddresses();

            return {
                addresses:
                    response?.data ?? [],

                message:
                    response?.message ??
                    "Address list retrieved successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// FETCH SINGLE ADDRESS
// GET /api/customer/addresses/{id}
// =====================================================

export const fetchAddress = createAsyncThunk(
    "customerAddress/fetchAddress",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message: "Address ID is required.",
                    errors: {},
                });
            }

            const response =
                await addressService.getAddress(id);

            return {
                address:
                    response?.data ?? null,

                message:
                    response?.message ??
                    "Address retrieved successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// CREATE ADDRESS
// POST /api/customer/addresses
// =====================================================

export const createAddress = createAsyncThunk(
    "customerAddress/createAddress",

    async (addressData, { rejectWithValue }) => {
        try {
            if (
                !addressData ||
                typeof addressData !== "object"
            ) {
                return rejectWithValue({
                    message: "Address data is required.",
                    errors: {},
                });
            }

            const response =
                await addressService.createAddress(
                    addressData
                );

            return {
                address:
                    response?.data ?? null,

                message:
                    response?.message ??
                    "Address created successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// UPDATE ADDRESS
// PUT /api/customer/addresses/{id}
// =====================================================

export const updateAddress = createAsyncThunk(
    "customerAddress/updateAddress",

    async (
        { id, addressData },
        { rejectWithValue }
    ) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message: "Address ID is required.",
                    errors: {},
                });
            }

            if (
                !addressData ||
                typeof addressData !== "object"
            ) {
                return rejectWithValue({
                    message: "Address data is required.",
                    errors: {},
                });
            }

            const response =
                await addressService.updateAddress(
                    id,
                    addressData
                );

            return {
                address:
                    response?.data ?? null,

                message:
                    response?.message ??
                    "Address updated successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// DELETE ADDRESS
// DELETE /api/customer/addresses/{id}
// =====================================================

export const deleteAddress = createAsyncThunk(
    "customerAddress/deleteAddress",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message: "Address ID is required.",
                    errors: {},
                });
            }

            const response =
                await addressService.deleteAddress(id);

            return {
                id,

                message:
                    response?.message ??
                    "Address deleted successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const addressSlice = createSlice({
    name: "customerAddress",

    initialState,

    reducers: {
        // =================================================
        // CLEAR ERROR
        // =================================================

        clearAddressError: (state) => {
            state.error = null;

            state.createError = null;
            state.updateError = null;
            state.deleteError = null;

            state.validationErrors = {};
        },

        // =================================================
        // CLEAR MESSAGE
        // IMPORTANT:
        // Addresses.jsx is importing this action
        // =================================================

        clearAddressMessage: (state) => {
            state.message = null;

            state.createMessage = null;
            state.updateMessage = null;
            state.deleteMessage = null;
        },

        // =================================================
        // CLEAR SUCCESS
        // =================================================

        clearAddressSuccess: (state) => {
            state.success = false;

            state.createSuccess = false;
            state.updateSuccess = false;
            state.deleteSuccess = false;
        },

        // =================================================
        // CLEAR CREATE STATE
        // =================================================

        clearCreateAddressState: (state) => {
            state.creating = false;
            state.createSuccess = false;
            state.createMessage = null;
            state.createError = null;
        },

        // =================================================
        // CLEAR UPDATE STATE
        // =================================================

        clearUpdateAddressState: (state) => {
            state.updating = false;
            state.updateSuccess = false;
            state.updateMessage = null;
            state.updateError = null;
        },

        // =================================================
        // CLEAR DELETE STATE
        // =================================================

        clearDeleteAddressState: (state) => {
            state.deleting = false;
            state.deleteSuccess = false;
            state.deleteMessage = null;
            state.deleteError = null;
        },

        // =================================================
        // CLEAR SELECTED ADDRESS
        // =================================================

        clearSelectedAddress: (state) => {
            state.address = null;
        },

        // =================================================
        // CLEAR ADDRESSES
        // =================================================

        clearAddresses: (state) => {
            state.addresses = [];
        },

        // =================================================
        // RESET STATE
        // =================================================

        resetAddressState: () => ({
            ...initialState,
        }),
    },

    // =====================================================
    // EXTRA REDUCERS
    // =====================================================

    extraReducers: (builder) => {
        // =================================================
        // FETCH ALL
        // =================================================

        builder
            .addCase(
                fetchAddresses.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                fetchAddresses.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.error = null;

                    state.addresses =
                        action.payload?.addresses ?? [];

                    state.message =
                        action.payload?.message ??
                        "Address list retrieved successfully.";
                }
            )

            .addCase(
                fetchAddresses.rejected,
                (state, action) => {
                    state.loading = false;

                    state.addresses = [];

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to retrieve addresses.";

                    state.validationErrors =
                        action.payload?.errors ?? {};
                }
            );

        // =================================================
        // FETCH SINGLE
        // =================================================

        builder
            .addCase(
                fetchAddress.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchAddress.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.error = null;

                    state.address =
                        action.payload?.address ?? null;

                    state.message =
                        action.payload?.message ??
                        "Address retrieved successfully.";
                }
            )

            .addCase(
                fetchAddress.rejected,
                (state, action) => {
                    state.loading = false;
                    state.address = null;

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to retrieve address.";

                    state.validationErrors =
                        action.payload?.errors ?? {};
                }
            );

        // =================================================
        // CREATE
        // =================================================

        builder
            .addCase(
                createAddress.pending,
                (state) => {
                    state.creating = true;

                    state.createSuccess = false;
                    state.createMessage = null;
                    state.createError = null;

                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                createAddress.fulfilled,
                (state, action) => {
                    state.creating = false;

                    state.createSuccess = true;
                    state.success = true;

                    state.createError = null;

                    const newAddress =
                        action.payload?.address;

                    if (newAddress) {
                        state.addresses = [
                            newAddress,
                            ...state.addresses,
                        ];

                        state.address =
                            newAddress;
                    }

                    state.createMessage =
                        action.payload?.message ??
                        "Address created successfully.";

                    state.message =
                        state.createMessage;
                }
            )

            .addCase(
                createAddress.rejected,
                (state, action) => {
                    state.creating = false;

                    state.createSuccess = false;
                    state.success = false;

                    state.createError =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to create address.";

                    state.error =
                        state.createError;

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.createMessage = null;
                }
            );

        // =================================================
        // UPDATE
        // =================================================

        builder
            .addCase(
                updateAddress.pending,
                (state) => {
                    state.updating = true;

                    state.updateSuccess = false;
                    state.updateMessage = null;
                    state.updateError = null;

                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                updateAddress.fulfilled,
                (state, action) => {
                    state.updating = false;

                    state.updateSuccess = true;
                    state.success = true;

                    state.updateError = null;

                    const updatedAddress =
                        action.payload?.address;

                    if (updatedAddress) {
                        state.address =
                            updatedAddress;

                        const index =
                            state.addresses.findIndex(
                                (item) =>
                                    String(item.id) ===
                                    String(
                                        updatedAddress.id
                                    )
                            );

                        if (index !== -1) {
                            state.addresses[index] =
                                updatedAddress;
                        }
                    }

                    state.updateMessage =
                        action.payload?.message ??
                        "Address updated successfully.";

                    state.message =
                        state.updateMessage;
                }
            )

            .addCase(
                updateAddress.rejected,
                (state, action) => {
                    state.updating = false;

                    state.updateSuccess = false;
                    state.success = false;

                    state.updateError =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to update address.";

                    state.error =
                        state.updateError;

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.updateMessage = null;
                }
            );

        // =================================================
        // DELETE
        // =================================================

        builder
            .addCase(
                deleteAddress.pending,
                (state) => {
                    state.deleting = true;

                    state.deleteSuccess = false;
                    state.deleteMessage = null;
                    state.deleteError = null;

                    state.error = null;
                }
            )

            .addCase(
                deleteAddress.fulfilled,
                (state, action) => {
                    state.deleting = false;

                    state.deleteSuccess = true;
                    state.success = true;

                    state.deleteError = null;

                    const deletedId =
                        action.payload?.id;

                    state.addresses =
                        state.addresses.filter(
                            (item) =>
                                String(item.id) !==
                                String(deletedId)
                        );

                    if (
                        state.address &&
                        String(state.address.id) ===
                            String(deletedId)
                    ) {
                        state.address = null;
                    }

                    state.deleteMessage =
                        action.payload?.message ??
                        "Address deleted successfully.";

                    state.message =
                        state.deleteMessage;
                }
            )

            .addCase(
                deleteAddress.rejected,
                (state, action) => {
                    state.deleting = false;

                    state.deleteSuccess = false;
                    state.success = false;

                    state.deleteError =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to delete address.";

                    state.error =
                        state.deleteError;

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.deleteMessage = null;
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearAddressError,
    clearAddressMessage,
    clearAddressSuccess,

    clearCreateAddressState,
    clearUpdateAddressState,
    clearDeleteAddressState,

    clearSelectedAddress,
    clearAddresses,

    resetAddressState,
} = addressSlice.actions;

// =====================================================
// STATE HELPER
// =====================================================
//
// IMPORTANT:
// Make sure your rootReducer uses:
// address: addressReducer
//
// These selectors therefore use state.address.
// =====================================================

const getAddressState = (state) =>
    state?.address ?? initialState;

// =====================================================
// COMPLETE STATE
// =====================================================

export const selectAddressState = (state) =>
    getAddressState(state);

// =====================================================
// ADDRESSES
// =====================================================

export const selectAddresses = (state) =>
    getAddressState(state).addresses ?? [];

// =====================================================
// SINGLE ADDRESS
// =====================================================

export const selectAddress = (state) =>
    getAddressState(state).address ?? null;

// =====================================================
// GENERAL LOADING
// =====================================================

export const selectAddressLoading = (state) =>
    getAddressState(state).loading ?? false;

// =====================================================
// CREATING
// =====================================================

export const selectAddressCreating = (state) =>
    getAddressState(state).creating ?? false;

export const selectAddressCreateSuccess = (
    state
) =>
    getAddressState(state).createSuccess ?? false;

export const selectAddressCreateMessage = (
    state
) =>
    getAddressState(state).createMessage ?? null;

export const selectAddressCreateError = (
    state
) =>
    getAddressState(state).createError ?? null;

// =====================================================
// UPDATING
// =====================================================

export const selectAddressUpdating = (state) =>
    getAddressState(state).updating ?? false;

export const selectAddressUpdateSuccess = (
    state
) =>
    getAddressState(state).updateSuccess ?? false;

export const selectAddressUpdateMessage = (
    state
) =>
    getAddressState(state).updateMessage ?? null;

export const selectAddressUpdateError = (
    state
) =>
    getAddressState(state).updateError ?? null;

// =====================================================
// DELETING
// =====================================================

export const selectAddressDeleting = (state) =>
    getAddressState(state).deleting ?? false;

export const selectAddressDeleteSuccess = (
    state
) =>
    getAddressState(state).deleteSuccess ?? false;

export const selectAddressDeleteMessage = (
    state
) =>
    getAddressState(state).deleteMessage ?? null;

export const selectAddressDeleteError = (
    state
) =>
    getAddressState(state).deleteError ?? null;

// =====================================================
// GENERAL SUCCESS
// =====================================================

export const selectAddressSuccess = (state) =>
    getAddressState(state).success ?? false;

// =====================================================
// GENERAL MESSAGE
// =====================================================

export const selectAddressMessage = (state) =>
    getAddressState(state).message ?? null;

// =====================================================
// GENERAL ERROR
// =====================================================

export const selectAddressError = (state) =>
    getAddressState(state).error ?? null;

// =====================================================
// VALIDATION ERRORS
// =====================================================

export const selectAddressValidationErrors = (
    state
) =>
    getAddressState(state).validationErrors ?? {};

// =====================================================
// DEFAULT REDUCER
// =====================================================

export default addressSlice.reducer;