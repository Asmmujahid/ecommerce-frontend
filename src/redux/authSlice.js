// src/redux/authSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import authService from "../Services/authService";

// =====================================================
// INITIAL STATE
// =====================================================

const getStoredUser = () => {
    try {
        const storedUser =
            localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error(
            "Failed to parse stored user:",
            error
        );

        return null;
    }
};

const getStoredToken = () => {
    return localStorage.getItem("token") || null;
};

const getStoredRole = () => {
    return localStorage.getItem("role") || null;
};

const initialState = {
    user: getStoredUser(),

    token: getStoredToken(),

    role: getStoredRole(),

    loading: false,

    error: null,

    isAuthenticated: !!getStoredToken(),

    // Seller approval information
    approvalStatus: null,
};

// =====================================================
// REGISTER
// =====================================================

export const register = createAsyncThunk(
    "auth/register",

    async (userData, thunkAPI) => {
        try {
            const response =
                await authService.register(
                    userData
                );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Registration failed"
            );
        }
    }
);

// =====================================================
// LOGIN
// =====================================================

export const login = createAsyncThunk(
    "auth/login",

    async (credentials, thunkAPI) => {
        try {
            const response =
                await authService.login(
                    credentials
                );

            return response.data;
        } catch (error) {
            const responseData =
                error.response?.data;

            return thunkAPI.rejectWithValue({
                message:
                    responseData?.message ||
                    "Login failed",

                approval_status:
                    responseData?.approval_status ||
                    null,

                status:
                    error.response?.status ||
                    null,
            });
        }
    }
);

// =====================================================
// LOGOUT
// =====================================================

export const logout = createAsyncThunk(
    "auth/logout",

    async (_, thunkAPI) => {
        try {
            await authService.logout();

            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Logout failed"
            );
        }
    }
);

// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword =
    createAsyncThunk(
        "auth/forgotPassword",

        async (emailData, thunkAPI) => {
            try {
                const response =
                    await authService.forgotPassword(
                        emailData
                    );

                return response.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data
                        ?.message ||
                        "Request failed"
                );
            }
        }
    );

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword =
    createAsyncThunk(
        "auth/resetPassword",

        async (data, thunkAPI) => {
            try {
                const response =
                    await authService.resetPassword(
                        data
                    );

                return response.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data
                        ?.message ||
                        "Reset password failed"
                );
            }
        }
    );

// =====================================================
// AUTH SLICE
// =====================================================

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        // =================================================
        // CLEAR ERROR
        // =================================================

        clearError: (state) => {
            state.error = null;
            state.approvalStatus = null;
        },

        // =================================================
        // UPDATE AUTH USER
        // =================================================

        updateUser: (
            state,
            action
        ) => {
            if (!action.payload) {
                return;
            }

            state.user = {
                ...state.user,
                ...action.payload,
            };

            localStorage.setItem(
                "user",
                JSON.stringify(
                    state.user
                )
            );
        },

        // =================================================
        // CLEAR AUTH
        // =================================================

        clearAuth: (state) => {
            state.user = null;

            state.token = null;

            state.role = null;

            state.isAuthenticated = false;

            state.error = null;

            state.approvalStatus = null;

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "role"
            );
        },
    },

    extraReducers: (builder) => {
        builder

            // =================================================
            // REGISTER - PENDING
            // =================================================

            .addCase(
                register.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;

                    state.approvalStatus = null;
                }
            )

            // =================================================
            // REGISTER - SUCCESS
            // =================================================

            .addCase(
                register.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error = null;

                    const {
                        user,
                        token,
                        role,
                        approved,
                    } =
                        action.payload;

                    state.user =
                        user || null;

                    state.role =
                        role || null;

                    /*
                     * IMPORTANT
                     *
                     * Customer registration:
                     * token exists.
                     *
                     * Seller registration:
                     * token is null because
                     * admin approval is required.
                     */

                    if (
                        token
                    ) {
                        state.token =
                            token;

                        state.isAuthenticated =
                            true;

                        localStorage.setItem(
                            "token",
                            token
                        );

                        if (user) {
                            localStorage.setItem(
                                "user",
                                JSON.stringify(
                                    user
                                )
                            );
                        }

                        if (role) {
                            localStorage.setItem(
                                "role",
                                role
                            );
                        }
                    } else {
                        /*
                         * Pending seller.
                         *
                         * Make absolutely sure
                         * there is no old token.
                         */

                        state.token = null;

                        state.isAuthenticated =
                            false;

                        state.approvalStatus =
                            approved === false
                                ? "pending"
                                : null;

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "user"
                        );

                        localStorage.removeItem(
                            "role"
                        );
                    }
                }
            )

            // =================================================
            // REGISTER - ERROR
            // =================================================

            .addCase(
                register.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Registration failed";

                    state.approvalStatus =
                        null;
                }
            )

            // =================================================
            // LOGIN - PENDING
            // =================================================

            .addCase(
                login.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;

                    state.approvalStatus = null;
                }
            )

            // =================================================
            // LOGIN - SUCCESS
            // =================================================

            .addCase(
                login.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error = null;

                    const {
                        user,
                        token,
                        role,
                        approved,
                    } =
                        action.payload;

                    /*
                     * Normally a successful login
                     * must contain a token.
                     */

                    if (!token) {
                        state.user =
                            user || null;

                        state.token = null;

                        state.role =
                            role || null;

                        state.isAuthenticated =
                            false;

                        state.approvalStatus =
                            approved === false
                                ? "pending"
                                : null;

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "user"
                        );

                        localStorage.removeItem(
                            "role"
                        );

                        state.error =
                            "Your account is not approved yet.";

                        return;
                    }

                    state.user =
                        user || null;

                    state.token =
                        token;

                    state.role =
                        role || null;

                    state.isAuthenticated =
                        true;

                    state.approvalStatus =
                        approved === false
                            ? "pending"
                            : "approved";

                    localStorage.setItem(
                        "token",
                        token
                    );

                    if (user) {
                        localStorage.setItem(
                            "user",
                            JSON.stringify(
                                user
                            )
                        );
                    }

                    if (role) {
                        localStorage.setItem(
                            "role",
                            role
                        );
                    }
                }
            )

            // =================================================
            // LOGIN - ERROR
            // =================================================

            .addCase(
                login.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    /*
                     * login thunk now returns
                     * an object containing message,
                     * status and approval_status.
                     */

                    const payload =
                        action.payload;

                    if (
                        typeof payload ===
                        "object"
                    ) {
                        state.error =
                            payload.message ||
                            "Login failed";

                        state.approvalStatus =
                            payload.approval_status ||
                            null;

                        /*
                         * If seller is pending,
                         * make sure frontend is
                         * NOT authenticated.
                         */

                        if (
                            payload.status ===
                            403
                        ) {
                            state.user =
                                null;

                            state.token =
                                null;

                            state.role =
                                null;

                            state.isAuthenticated =
                                false;

                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            localStorage.removeItem(
                                "role"
                            );
                        }
                    } else {
                        state.error =
                            payload ||
                            "Login failed";
                    }
                }
            )

            // =================================================
            // LOGOUT - PENDING
            // =================================================

            .addCase(
                logout.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;
                }
            )

            // =================================================
            // LOGOUT - SUCCESS
            // =================================================

            .addCase(
                logout.fulfilled,
                (state) => {
                    state.loading = false;

                    state.user = null;

                    state.token = null;

                    state.role = null;

                    state.isAuthenticated =
                        false;

                    state.error = null;

                    state.approvalStatus =
                        null;

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "role"
                    );
                }
            )

            // =================================================
            // LOGOUT - ERROR
            // =================================================

            .addCase(
                logout.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        typeof action.payload ===
                        "string"
                            ? action.payload
                            : action.payload
                                  ?.message ||
                              "Logout failed";

                    /*
                     * Even if Laravel logout
                     * fails, clear local auth.
                     */

                    state.user = null;

                    state.token = null;

                    state.role = null;

                    state.isAuthenticated =
                        false;

                    state.approvalStatus =
                        null;

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "role"
                    );
                }
            )

            // =================================================
            // FORGOT PASSWORD
            // =================================================

            .addCase(
                forgotPassword.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                forgotPassword.fulfilled,
                (state) => {
                    state.loading = false;

                    state.error = null;
                }
            )

            .addCase(
                forgotPassword.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload;
                }
            )

            // =================================================
            // RESET PASSWORD
            // =================================================

            .addCase(
                resetPassword.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                resetPassword.fulfilled,
                (state) => {
                    state.loading = false;

                    state.error = null;
                }
            )

            .addCase(
                resetPassword.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload;
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearError,
    updateUser,
    clearAuth,
} = authSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectAuthUser = (
    state
) =>
    state.auth?.user || null;

export const selectAuthToken = (
    state
) =>
    state.auth?.token || null;

export const selectAuthRole = (
    state
) =>
    state.auth?.role || null;

export const selectIsAuthenticated = (
    state
) =>
    state.auth?.isAuthenticated ||
    false;

export const selectApprovalStatus = (
    state
) =>
    state.auth?.approvalStatus ||
    null;

// =====================================================
// EXPORT
// =====================================================

export default authSlice.reducer;

