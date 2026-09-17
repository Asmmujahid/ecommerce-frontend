
// src/components/notification/NotificationBell.jsx

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Badge,
    IconButton,
    Tooltip,
} from "@mui/material";

import NotificationsIcon from
    "@mui/icons-material/Notifications";

import {
    fetchUnreadCount,
    selectUnreadNotificationCount,
} from "../../redux/notificationSlice";

// =====================================================
// COMPONENT
// =====================================================

const NotificationBell = ({
    onClick,
}) => {
    const dispatch = useDispatch();

    const unreadCount =
        useSelector(
            selectUnreadNotificationCount
        );

    // =================================================
    // FETCH UNREAD COUNT
    // =================================================

    useEffect(() => {
        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            return;
        }

        dispatch(
            fetchUnreadCount()
        );

        const interval =
            setInterval(() => {
                const currentToken =
                    localStorage.getItem(
                        "token"
                    );

                if (currentToken) {
                    dispatch(
                        fetchUnreadCount()
                    );
                }
            }, 15000);

        return () => {
            clearInterval(
                interval
            );
        };
    }, [dispatch]);

    // =================================================
    // AUTH CHECK
    // =================================================

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {
        return null;
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Tooltip title="Notifications">
            <IconButton
                color="inherit"
                onClick={onClick}
                aria-label="notifications"
            >
                <Badge
                    badgeContent={
                        unreadCount
                    }
                    color="error"
                    max={99}
                    showZero={false}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>
        </Tooltip>
    );
};

export default NotificationBell;

