
// src/redux/customer/notificationSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import notificationService from "../../Services/customer/notificationService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    // All notifications
    notifications: [],

    // Unread notifications
    unreadNotifications: [],

    // Number of unread notifications
    unreadCount: 0,

    // Selected notification
    notification: null,

    // Loading states
    loading: false,
    unreadLoading: false,
    singleLoading: false,
    markingRead: false,
    markingAllRead: false,
    deleting: false,

    // Messages
    message: "",

    // Error
    error: null,
};

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

export const getNotifications = createAsyncThunk(
    "customerNotification/getNotifications",

    async (_, thunkAPI) => {
        try {
            const response =
                await notificationService.getNotifications();

            return response;
        } catch (error) {
            console.error(
                "getNotifications thunk error:",
                error
            );

            return thunkAPI.rejectWithValue(
                getErrorPayload(
                    error,
                    "Failed to load notifications."
                )
            );
        }
    }
);

// =====================================================
// GET UNREAD NOTIFICATIONS
// =====================================================

export const getUnreadNotifications =
    createAsyncThunk(
        "customerNotification/getUnreadNotifications",

        async (_, thunkAPI) => {
            try {
                const response =
                    await notificationService.getUnreadNotifications();

                return response;
            } catch (error) {
                console.error(
                    "getUnreadNotifications thunk error:",
                    error
                );

                return thunkAPI.rejectWithValue(
                    getErrorPayload(
                        error,
                        "Failed to load unread notifications."
                    )
                );
            }
        }
    );

// =====================================================
// GET SINGLE NOTIFICATION
// =====================================================

export const getNotification = createAsyncThunk(
    "customerNotification/getNotification",

    async (id, thunkAPI) => {
        try {
            const response =
                await notificationService.getNotification(
                    id
                );

            return response;
        } catch (error) {
            console.error(
                "getNotification thunk error:",
                error
            );

            return thunkAPI.rejectWithValue(
                getErrorPayload(
                    error,
                    "Failed to load notification."
                )
            );
        }
    }
);

// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

export const markNotificationAsRead =
    createAsyncThunk(
        "customerNotification/markNotificationAsRead",

        async (id, thunkAPI) => {
            try {
                const response =
                    await notificationService.markAsRead(
                        id
                    );

                return {
                    id,
                    response,
                };
            } catch (error) {
                console.error(
                    "markNotificationAsRead thunk error:",
                    error
                );

                return thunkAPI.rejectWithValue(
                    getErrorPayload(
                        error,
                        "Failed to mark notification as read."
                    )
                );
            }
        }
    );

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

export const markAllNotificationsAsRead =
    createAsyncThunk(
        "customerNotification/markAllNotificationsAsRead",

        async (_, thunkAPI) => {
            try {
                const response =
                    await notificationService.markAllAsRead();

                return response;
            } catch (error) {
                console.error(
                    "markAllNotificationsAsRead thunk error:",
                    error
                );

                return thunkAPI.rejectWithValue(
                    getErrorPayload(
                        error,
                        "Failed to mark all notifications as read."
                    )
                );
            }
        }
    );

// =====================================================
// DELETE NOTIFICATION
// =====================================================

export const deleteNotification = createAsyncThunk(
    "customerNotification/deleteNotification",

    async (id, thunkAPI) => {
        try {
            const response =
                await notificationService.deleteNotification(
                    id
                );

            return {
                id,
                response,
            };
        } catch (error) {
            console.error(
                "deleteNotification thunk error:",
                error
            );

            return thunkAPI.rejectWithValue(
                getErrorPayload(
                    error,
                    "Failed to delete notification."
                )
            );
        }
    }
);

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorPayload = (
    error,
    defaultMessage
) => {
    const responseData =
        error?.response?.data;

    return {
        message:
            responseData?.message ||
            error?.message ||
            defaultMessage,

        errors:
            responseData?.errors || {},

        status:
            error?.response?.status || null,
    };
};

// =====================================================
// SLICE
// =====================================================

const notificationSlice = createSlice({
    name: "customerNotification",

    initialState,

    reducers: {
        // =================================================
        // CLEAR ERROR
        // =================================================

        clearNotificationError: (state) => {
            state.error = null;
        },

        // =================================================
        // CLEAR MESSAGE
        // =================================================

        clearNotificationMessage: (state) => {
            state.message = "";
        },

        // =================================================
        // CLEAR SELECTED NOTIFICATION
        // =================================================

        clearSelectedNotification: (state) => {
            state.notification = null;
        },

        // =================================================
        // RESET STATE
        // =================================================

        resetNotificationState: () => {
            return {
                ...initialState,
            };
        },
    },

    extraReducers: (builder) => {
        // =================================================
        // GET ALL NOTIFICATIONS
        // =================================================

        builder.addCase(
            getNotifications.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addCase(
            getNotifications.fulfilled,
            (state, action) => {
                state.loading = false;

                state.notifications =
                    Array.isArray(
                        action.payload?.data
                    )
                        ? action.payload.data
                        : [];

                state.error = null;

                state.unreadCount =
                    state.notifications.filter(
                        (notification) =>
                            notification.read_at === null
                    ).length;
            }
        );

        builder.addCase(
            getNotifications.rejected,
            (state, action) => {
                state.loading = false;

                state.notifications = [];

                state.unreadCount = 0;

                state.error =
                    action.payload?.message ||
                    "Failed to load notifications.";
            }
        );

        // =================================================
        // GET UNREAD NOTIFICATIONS
        // =================================================

        builder.addCase(
            getUnreadNotifications.pending,
            (state) => {
                state.unreadLoading = true;
                state.error = null;
            }
        );

        builder.addCase(
            getUnreadNotifications.fulfilled,
            (state, action) => {
                state.unreadLoading = false;

                state.unreadNotifications =
                    Array.isArray(
                        action.payload?.data
                    )
                        ? action.payload.data
                        : [];

                state.unreadCount =
                    state.unreadNotifications.length;

                state.error = null;
            }
        );

        builder.addCase(
            getUnreadNotifications.rejected,
            (state, action) => {
                state.unreadLoading = false;

                state.unreadNotifications = [];

                state.unreadCount = 0;

                state.error =
                    action.payload?.message ||
                    "Failed to load unread notifications.";
            }
        );

        // =================================================
        // GET SINGLE NOTIFICATION
        // =================================================

        builder.addCase(
            getNotification.pending,
            (state) => {
                state.singleLoading = true;
                state.error = null;
            }
        );

        builder.addCase(
            getNotification.fulfilled,
            (state, action) => {
                state.singleLoading = false;

                state.notification =
                    action.payload?.data || null;

                state.error = null;
            }
        );

        builder.addCase(
            getNotification.rejected,
            (state, action) => {
                state.singleLoading = false;

                state.notification = null;

                state.error =
                    action.payload?.message ||
                    "Failed to load notification.";
            }
        );

        // =================================================
        // MARK ONE NOTIFICATION AS READ
        // =================================================

        builder.addCase(
            markNotificationAsRead.pending,
            (state) => {
                state.markingRead = true;
                state.error = null;
            }
        );

        builder.addCase(
            markNotificationAsRead.fulfilled,
            (state, action) => {
                state.markingRead = false;

                const notificationId =
                    action.payload?.id;

                // -----------------------------------------
                // Update all notifications
                // -----------------------------------------

                state.notifications =
                    state.notifications.map(
                        (notification) => {
                            if (
                                notification.id ===
                                notificationId
                            ) {
                                return {
                                    ...notification,
                                    read_at:
                                        new Date().toISOString(),
                                };
                            }

                            return notification;
                        }
                    );

                // -----------------------------------------
                // Remove from unread list
                // -----------------------------------------

                state.unreadNotifications =
                    state.unreadNotifications.filter(
                        (notification) =>
                            notification.id !==
                            notificationId
                    );

                // -----------------------------------------
                // Recalculate unread count
                // -----------------------------------------

                state.unreadCount =
                    state.unreadNotifications.length;

                state.message =
                    action.payload?.response
                        ?.message ||
                    "Notification marked as read.";

                state.error = null;
            }
        );

        builder.addCase(
            markNotificationAsRead.rejected,
            (state, action) => {
                state.markingRead = false;

                state.error =
                    action.payload?.message ||
                    "Failed to mark notification as read.";
            }
        );

        // =================================================
        // MARK ALL NOTIFICATIONS AS READ
        // =================================================

        builder.addCase(
            markAllNotificationsAsRead.pending,
            (state) => {
                state.markingAllRead = true;
                state.error = null;
            }
        );

        builder.addCase(
            markAllNotificationsAsRead.fulfilled,
            (state, action) => {
                state.markingAllRead = false;

                // -----------------------------------------
                // Mark every notification as read
                // -----------------------------------------

                state.notifications =
                    state.notifications.map(
                        (notification) => ({
                            ...notification,
                            read_at:
                                notification.read_at ||
                                new Date().toISOString(),
                        })
                    );

                // -----------------------------------------
                // Empty unread notifications
                // -----------------------------------------

                state.unreadNotifications = [];

                state.unreadCount = 0;

                state.message =
                    action.payload?.message ||
                    "All notifications marked as read.";

                state.error = null;
            }
        );

        builder.addCase(
            markAllNotificationsAsRead.rejected,
            (state, action) => {
                state.markingAllRead = false;

                state.error =
                    action.payload?.message ||
                    "Failed to mark all notifications as read.";
            }
        );

        // =================================================
        // DELETE NOTIFICATION
        // =================================================

        builder.addCase(
            deleteNotification.pending,
            (state) => {
                state.deleting = true;
                state.error = null;
            }
        );

        builder.addCase(
            deleteNotification.fulfilled,
            (state, action) => {
                state.deleting = false;

                const notificationId =
                    action.payload?.id;

                // -----------------------------------------
                // Remove from all notifications
                // -----------------------------------------

                state.notifications =
                    state.notifications.filter(
                        (notification) =>
                            notification.id !==
                            notificationId
                    );

                // -----------------------------------------
                // Remove from unread notifications
                // -----------------------------------------

                state.unreadNotifications =
                    state.unreadNotifications.filter(
                        (notification) =>
                            notification.id !==
                            notificationId
                    );

                // -----------------------------------------
                // Recalculate unread count
                // -----------------------------------------

                state.unreadCount =
                    state.unreadNotifications.length;

                // -----------------------------------------
                // Clear selected notification
                // -----------------------------------------

                if (
                    state.notification?.id ===
                    notificationId
                ) {
                    state.notification = null;
                }

                state.message =
                    action.payload?.response
                        ?.message ||
                    "Notification deleted successfully.";

                state.error = null;
            }
        );

        builder.addCase(
            deleteNotification.rejected,
            (state, action) => {
                state.deleting = false;

                state.error =
                    action.payload?.message ||
                    "Failed to delete notification.";
            }
        );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearNotificationError,
    clearNotificationMessage,
    clearSelectedNotification,
    resetNotificationState,
} = notificationSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default notificationSlice.reducer;

