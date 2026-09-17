import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../Services/admin/userService";

// ==========================================
// Get Users
// ==========================================

export const getUsers = createAsyncThunk(
    "adminUser/getUsers",
    async (_, thunkAPI) => {
        try {
            return await userService.getUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch users"
            );
        }
    }
);

// ==========================================
// Get Single User
// ==========================================

export const getUser = createAsyncThunk(
    "adminUser/getUser",
    async (id, thunkAPI) => {
        try {
            return await userService.getUser(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch user"
            );
        }
    }
);

// ==========================================
// Update User
// ==========================================

export const updateUser = createAsyncThunk(
    "adminUser/updateUser",
    async ({ id, userData }, thunkAPI) => {
        try {
            return await userService.updateUser(id, userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to update user"
            );
        }
    }
);

// ==========================================
// Delete User
// ==========================================

export const deleteUser = createAsyncThunk(
    "adminUser/deleteUser",
    async (id, thunkAPI) => {
        try {
            await userService.deleteUser(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to delete user"
            );
        }
    }
);

// ==========================================
// Initial State
// ==========================================

const initialState = {
    users: [],
    user: null,
    loading: false,
    success: false,
    error: null,
};

// ==========================================
// Helpers
// ==========================================

const extractUsers = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    // Laravel pagination:
    // {
    //     data: {
    //         current_page: 1,
    //         data: [...]
    //     }
    // }
    if (Array.isArray(payload?.data?.data)) {
        return payload.data.data;
    }

    return [];
};

const extractUser = (payload) => {
    if (payload?.data && !Array.isArray(payload.data)) {
        return payload.data;
    }

    return payload;
};

// ==========================================
// Slice
// ==========================================

const userSlice = createSlice({
    name: "adminUser",

    initialState,

    reducers: {
        resetUserState: (state) => {
            state.user = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        clearUserError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // GET USERS
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = extractUsers(action.payload);
            })

            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload || "Failed to fetch users";
            })

            // GET USER
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = extractUser(action.payload);
            })

            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload || "Failed to fetch user";
            })

            // UPDATE USER
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const updatedUser = extractUser(action.payload);

                if (!updatedUser?.id) {
                    return;
                }

                const index = state.users.findIndex(
                    (user) => user.id === updatedUser.id
                );

                if (index !== -1) {
                    state.users[index] = {
                        ...state.users[index],
                        ...updatedUser,
                    };
                }

                state.user = updatedUser;
            })

            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload || "Failed to update user";
            })

            // DELETE USER
            .addCase(deleteUser.pending, (state) => {
                state.error = null;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.success = true;

                state.users = state.users.filter(
                    (user) => user.id !== action.payload
                );
            })

            .addCase(deleteUser.rejected, (state, action) => {
                state.success = false;
                state.error =
                    action.payload || "Failed to delete user";
            });
    },
});

export const {
    resetUserState,
    clearUserError,
} = userSlice.actions;

export default userSlice.reducer;