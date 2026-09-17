
// src/services/notificationService.js

import axios from "../api/axios";

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

const getNotifications = async (
    page = 1,
    perPage = 20
) => {
    try {
        const response = await axios.get(
            "/notifications",
            {
                params: {
                    page,
                    per_page: perPage,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to fetch notifications:",
            error
        );

        throw error;
    }
};

// =====================================================
// GET UNREAD NOTIFICATIONS
// =====================================================

const getUnreadNotifications = async () => {
    try {
        const response = await axios.get(
            "/notifications/unread"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to fetch unread notifications:",
            error
        );

        throw error;
    }
};

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// =====================================================

const getUnreadCount = async () => {
    try {
        const response = await axios.get(
            "/notifications/unread-count"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to fetch unread notification count:",
            error
        );

        throw error;
    }
};

// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

const markAsRead = async (
    notificationId
) => {
    if (!notificationId) {
        throw new Error(
            "Notification ID is required."
        );
    }

    try {
        /*
         * Laravel route:
         *
         * PUT /api/notifications/{id}/read
         */
        const response = await axios.put(
            `/notifications/${notificationId}/read`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to mark notification as read:",
            error
        );

        throw error;
    }
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

const markAllAsRead = async () => {
    try {
        /*
         * Laravel route:
         *
         * PUT /api/notifications/read-all
         */
        const response = await axios.put(
            "/notifications/read-all"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to mark all notifications as read:",
            error
        );

        throw error;
    }
};

// =====================================================
// DELETE ONE NOTIFICATION
// =====================================================

const deleteNotification = async (
    notificationId
) => {
    if (!notificationId) {
        throw new Error(
            "Notification ID is required."
        );
    }

    try {
        /*
         * Laravel route:
         *
         * DELETE /api/notifications/{id}
         */
        const response = await axios.delete(
            `/notifications/${notificationId}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to delete notification:",
            error
        );

        throw error;
    }
};

// =====================================================
// DELETE ALL NOTIFICATIONS
// =====================================================

const deleteAllNotifications = async () => {
    try {
        /*
         * Laravel route:
         *
         * DELETE /api/notifications
         */
        const response = await axios.delete(
            "/notifications"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to delete all notifications:",
            error
        );

        throw error;
    }
};

// =====================================================
// EXPORT SERVICE
// =====================================================

const notificationService = {
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
};

export default notificationService;

