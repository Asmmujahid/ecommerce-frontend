
// src/components/notification/HeaderNotifications.jsx

import { useState } from "react";

import NotificationBell from "./NotificationBell";
import NotificationMenu from "./NotificationMenu";

// =====================================================
// COMPONENT
// =====================================================

const HeaderNotifications = () => {
    const [
        notificationAnchor,
        setNotificationAnchor,
    ] = useState(null);

    // =================================================
    // OPEN MENU
    // =================================================

    const handleNotificationOpen = (
        event
    ) => {
        setNotificationAnchor(
            event.currentTarget
        );
    };

    // =================================================
    // CLOSE MENU
    // =================================================

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <>
            <NotificationBell
                onClick={
                    handleNotificationOpen
                }
            />

            <NotificationMenu
                anchorEl={
                    notificationAnchor
                }
                open={
                    Boolean(
                        notificationAnchor
                    )
                }
                onClose={
                    handleNotificationClose
                }
            />
        </>
    );
};

export default HeaderNotifications;

