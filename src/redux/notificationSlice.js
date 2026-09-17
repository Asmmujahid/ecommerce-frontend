
// src/redux/notificationSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import notificationService from "../Services/notificationService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    notifications: [],

    unreadCount: 0,

    loading: false,

    unreadLoading: false,

    markingRead: false,

    markingAllRead: false,

    deleting: false,

    deletingAll: false,

    error: null,

    success: false,

    message: "",

    pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0,
    },
};

// =====================================================
// FETCH ALL NOTIFICATIONS
// =====================================================

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",

    async (
        {
            page = 1,
            perPage = 20,
        } = {},
        thunkAPI
    ) => {
        try {
            const response =
                await notificationService.getNotifications(
                    page,
                    perPage
                );

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to load notifications."
            );
        }
    }
);

// =====================================================
// FETCH UNREAD NOTIFICATIONS
// =====================================================

export const fetchUnreadNotifications =
    createAsyncThunk(
        "notifications/fetchUnreadNotifications",

        async (_, thunkAPI) => {
            try {
                const response =
                    await notificationService.getUnreadNotifications();

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to load unread notifications."
                );
            }
        }
    );

// =====================================================
// FETCH UNREAD COUNT
// =====================================================

export const fetchUnreadCount =
    createAsyncThunk(
        "notifications/fetchUnreadCount",

        async (_, thunkAPI) => {
            try {
                const response =
                    await notificationService.getUnreadCount();

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to load notification count."
                );
            }
        }
    );

// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

export const markNotificationAsRead =
    createAsyncThunk(
        "notifications/markNotificationAsRead",

        async (
            notificationId,
            thunkAPI
        ) => {
            try {
                const response =
                    await notificationService.markAsRead(
                        notificationId
                    );

                return {
                    id: notificationId,
                    response,
                };
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to mark notification as read."
                );
            }
        }
    );

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

export const markAllNotificationsAsRead =
    createAsyncThunk(
        "notifications/markAllNotificationsAsRead",

        async (_, thunkAPI) => {
            try {
                const response =
                    await notificationService.markAllAsRead();

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to mark all notifications as read."
                );
            }
        }
    );

// =====================================================
// DELETE ONE NOTIFICATION
// =====================================================

export const deleteNotification =
    createAsyncThunk(
        "notifications/deleteNotification",

        async (
            notificationId,
            thunkAPI
        ) => {
            try {
                const response =
                    await notificationService.deleteNotification(
                        notificationId
                    );

                return {
                    id: notificationId,
                    response,
                };
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to delete notification."
                );
            }
        }
    );

// =====================================================
// DELETE ALL NOTIFICATIONS
// =====================================================

export const deleteAllNotifications =
    createAsyncThunk(
        "notifications/deleteAllNotifications",

        async (_, thunkAPI) => {
            try {
                const response =
                    await notificationService.deleteAllNotifications();

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to delete notifications."
                );
            }
        }
    );

// =====================================================
// SLICE
// =====================================================

const notificationSlice = createSlice({
    name: "notifications",

    initialState,

    reducers: {
        // =================================================
        // CLEAR ERROR
        // =================================================

        clearNotificationError: (
            state
        ) => {
            state.error = null;
        },

        // =================================================
        // CLEAR SUCCESS
        // =================================================

        clearNotificationSuccess: (
            state
        ) => {
            state.success = false;
            state.message = "";
        },

        // =================================================
        // CLEAR NOTIFICATIONS
        // =================================================

        clearNotifications: (
            state
        ) => {
            state.notifications = [];

            state.unreadCount = 0;

            state.pagination = {
                currentPage: 1,
                lastPage: 1,
                perPage: 20,
                total: 0,
            };
        },
    },

    extraReducers: (builder) => {

        // =================================================
        // FETCH ALL NOTIFICATIONS
        // =================================================

        builder

            .addCase(
                fetchNotifications.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchNotifications.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const payload =
                        action.payload || {};

                    /*
                     * Laravel response:
                     *
                     * {
                     *     success: true,
                     *     message: "...",
                     *     data: [],
                     *     pagination: {
                     *         current_page: 1,
                     *         last_page: 2,
                     *         per_page: 20,
                     *         total: 25
                     *     }
                     * }
                     */

                    state.notifications =
                        Array.isArray(
                            payload.data
                        )
                            ? payload.data
                            : [];

                    /*
                     * IMPORTANT:
                     *
                     * Your Laravel controller uses:
                     *
                     * payload.pagination
                     *
                     * NOT:
                     *
                     * payload.meta
                     */

                    state.pagination = {
                        currentPage:
                            Number(
                                payload
                                    .pagination
                                    ?.current_page ??
                                    1
                            ),

                        lastPage:
                            Number(
                                payload
                                    .pagination
                                    ?.last_page ??
                                    1
                            ),

                        perPage:
                            Number(
                                payload
                                    .pagination
                                    ?.per_page ??
                                    20
                            ),

                        total:
                            Number(
                                payload
                                    .pagination
                                    ?.total ??
                                    0
                            ),
                    };

                    state.error = null;
                }
            )

            .addCase(
                fetchNotifications.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to load notifications.";
                }
            );

        // =================================================
        // FETCH UNREAD NOTIFICATIONS
        // =================================================

        builder

            .addCase(
                fetchUnreadNotifications.pending,
                (state) => {
                    state.unreadLoading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchUnreadNotifications.fulfilled,
                (state, action) => {
                    state.unreadLoading = false;

                    const payload =
                        action.payload || {};

                    if (
                        Array.isArray(
                            payload.data
                        )
                    ) {
                        state.notifications =
                            payload.data;
                    }

                    /*
                     * Laravel returns:
                     *
                     * count
                     */

                    if (
                        payload.count !==
                        undefined
                    ) {
                        state.unreadCount =
                            Number(
                                payload.count
                            );
                    }

                    /*
                     * Some APIs may return
                     * unread_count.
                     */

                    else if (
                        payload.unread_count !==
                        undefined
                    ) {
                        state.unreadCount =
                            Number(
                                payload.unread_count
                            );
                    }

                    state.error = null;
                }
            )

            .addCase(
                fetchUnreadNotifications.rejected,
                (state, action) => {
                    state.unreadLoading = false;

                    state.error =
                        action.payload ||
                        "Failed to load unread notifications.";
                }
            );

        // =================================================
        // FETCH UNREAD COUNT
        // =================================================

        builder

            .addCase(
                fetchUnreadCount.pending,
                (state) => {
                    state.unreadLoading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchUnreadCount.fulfilled,
                (state, action) => {
                    state.unreadLoading = false;

                    const payload =
                        action.payload || {};

                    /*
                     * Your Laravel controller returns:
                     *
                     * data: {
                     *     count: 5
                     * }
                     *
                     * AND:
                     *
                     * count: 5
                     */

                    const count =
                        payload.data?.count ??
                        payload.count ??
                        payload.unread_count ??
                        0;

                    state.unreadCount =
                        Number(count);

                    state.error = null;
                }
            )

            .addCase(
                fetchUnreadCount.rejected,
                (state, action) => {
                    state.unreadLoading = false;

                    state.error =
                        action.payload ||
                        "Failed to load notification count.";
                }
            );

        // =================================================
        // MARK ONE AS READ
        // =================================================

        builder

            .addCase(
                markNotificationAsRead.pending,
                (state) => {
                    state.markingRead = true;

                    state.error = null;
                }
            )

            .addCase(
                markNotificationAsRead.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.markingRead = false;

                    const id =
                        action.payload?.id;

                    const notification =
                        state.notifications.find(
                            (item) =>
                                String(
                                    item.id
                                ) ===
                                String(id)
                        );

                    if (
                        notification &&
                        !notification.read_at
                    ) {
                        notification.read_at =
                            new Date().toISOString();

                        state.unreadCount =
                            Math.max(
                                0,
                                Number(
                                    state.unreadCount
                                ) - 1
                            );
                    }

                    state.error = null;
                }
            )

            .addCase(
                markNotificationAsRead.rejected,
                (state, action) => {
                    state.markingRead = false;

                    state.error =
                        action.payload ||
                        "Failed to mark notification as read.";
                }
            );

        // =================================================
        // MARK ALL AS READ
        // =================================================

        builder

            .addCase(
                markAllNotificationsAsRead.pending,
                (state) => {
                    state.markingAllRead = true;

                    state.error = null;
                }
            )

            .addCase(
                markAllNotificationsAsRead.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.markingAllRead = false;

                    const now =
                        new Date().toISOString();

                    state.notifications =
                        state.notifications.map(
                            (
                                notification
                            ) => ({
                                ...notification,

                                read_at:
                                    notification.read_at ||
                                    now,
                            })
                        );

                    state.unreadCount = 0;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "All notifications marked as read.";

                    state.error = null;
                }
            )

            .addCase(
                markAllNotificationsAsRead.rejected,
                (state, action) => {
                    state.markingAllRead = false;

                    state.error =
                        action.payload ||
                        "Failed to mark all notifications as read.";
                }
            );

        // =================================================
        // DELETE ONE NOTIFICATION
        // =================================================

        builder

            .addCase(
                deleteNotification.pending,
                (state) => {
                    state.deleting = true;

                    state.error = null;
                }
            )

            .addCase(
                deleteNotification.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.deleting = false;

                    const id =
                        action.payload?.id;

                    const notification =
                        state.notifications.find(
                            (item) =>
                                String(
                                    item.id
                                ) ===
                                String(id)
                        );

                    /*
                     * Decrease unread count only
                     * when deleted notification
                     * was unread.
                     */

                    if (
                        notification &&
                        !notification.read_at
                    ) {
                        state.unreadCount =
                            Math.max(
                                0,
                                Number(
                                    state.unreadCount
                                ) - 1
                            );
                    }

                    /*
                     * Remove notification
                     * from Redux state.
                     */

                    state.notifications =
                        state.notifications.filter(
                            (item) =>
                                String(
                                    item.id
                                ) !==
                                String(id)
                        );

                    /*
                     * Update total.
                     */

                    state.pagination.total =
                        Math.max(
                            0,
                            Number(
                                state.pagination
                                    .total
                            ) - 1
                        );

                    state.success = true;

                    state.message =
                        action.payload
                            ?.response
                            ?.message ||
                        "Notification deleted successfully.";

                    state.error = null;
                }
            )

            .addCase(
                deleteNotification.rejected,
                (state, action) => {
                    state.deleting = false;

                    state.error =
                        action.payload ||
                        "Failed to delete notification.";
                }
            );

        // =================================================
        // DELETE ALL NOTIFICATIONS
        // =================================================

        builder

            .addCase(
                deleteAllNotifications.pending,
                (state) => {
                    state.deletingAll = true;

                    state.error = null;
                }
            )

            .addCase(
                deleteAllNotifications.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.deletingAll = false;

                    state.notifications = [];

                    state.unreadCount = 0;

                    state.pagination = {
                        currentPage: 1,
                        lastPage: 1,
                        perPage: 20,
                        total: 0,
                    };

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "All notifications deleted successfully.";

                    state.error = null;
                }
            )

            .addCase(
                deleteAllNotifications.rejected,
                (state, action) => {
                    state.deletingAll = false;

                    state.error =
                        action.payload ||
                        "Failed to delete notifications.";
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearNotificationError,
    clearNotificationSuccess,
    clearNotifications,
} = notificationSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectNotifications = (
    state
) =>
    state.notifications
        ?.notifications || [];

// =====================================================
// UNREAD COUNT
// =====================================================

export const selectUnreadNotificationCount = (
    state
) =>
    Number(
        state.notifications
            ?.unreadCount || 0
    );

// =====================================================
// LOADING
// =====================================================

export const selectNotificationLoading = (
    state
) =>
    state.notifications
        ?.loading || false;

// =====================================================
// UNREAD LOADING
// =====================================================

export const selectNotificationUnreadLoading = (
    state
) =>
    state.notifications
        ?.unreadLoading || false;

// =====================================================
// MARK ONE AS READ
// =====================================================

export const selectNotificationMarkingRead = (
    state
) =>
    state.notifications
        ?.markingRead || false;

// =====================================================
// MARK ALL AS READ
// =====================================================

export const selectNotificationMarkingAllRead = (
    state
) =>
    state.notifications
        ?.markingAllRead || false;

// =====================================================
// DELETE ONE
// =====================================================

export const selectNotificationDeleting = (
    state
) =>
    state.notifications
        ?.deleting || false;

// =====================================================
// DELETE ALL
// =====================================================

export const selectNotificationDeletingAll = (
    state
) =>
    state.notifications
        ?.deletingAll || false;

// =====================================================
// ERROR
// =====================================================

export const selectNotificationError = (
    state
) =>
    state.notifications
        ?.error || null;

// =====================================================
// SUCCESS
// =====================================================

export const selectNotificationSuccess = (
    state
) =>
    state.notifications
        ?.success || false;

// =====================================================
// MESSAGE
// =====================================================

export const selectNotificationMessage = (
    state
) =>
    state.notifications
        ?.message || "";

// =====================================================
// PAGINATION
// =====================================================

export const selectNotificationPagination = (
    state
) =>
    state.notifications
        ?.pagination || {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0,
    };

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default notificationSlice.reducer;

