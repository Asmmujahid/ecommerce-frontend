
// src/components/customer/dashboard/RecentNotifications.jsx

import React from "react";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Typography,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";

// =====================================================
// COMPONENT
// =====================================================

const RecentNotifications = ({
    notifications = [],
    loading = false,
}) => {
    // =================================================
    // NORMALIZE NOTIFICATIONS
    // =================================================

    const notificationList = Array.isArray(
        notifications
    )
        ? notifications
        : [];

    // =================================================
    // NOTIFICATION TYPE
    // =================================================

    const getNotificationType = (
        notification
    ) => {
        return String(
            notification?.data?.type ||
                notification?.type ||
                ""
        ).toLowerCase();
    };

    // =================================================
    // NOTIFICATION ICON
    // =================================================

    const getNotificationIcon = (
        notification
    ) => {
        const type =
            getNotificationType(
                notification
            );

        if (
            type.includes("order") ||
            type.includes("placed")
        ) {
            return <ShoppingBagIcon />;
        }

        if (
            type.includes("shipping") ||
            type.includes("shipped") ||
            type.includes("delivery")
        ) {
            return <LocalShippingIcon />;
        }

        if (
            type.includes("payment") ||
            type.includes("paid") ||
            type.includes("payment_received")
        ) {
            return <PaymentIcon />;
        }

        if (
            type.includes("completed") ||
            type.includes("success")
        ) {
            return <CheckCircleIcon />;
        }

        if (
            type.includes("cancel")
        ) {
            return <CancelIcon />;
        }

        return <InfoIcon />;
    };

    // =================================================
    // NOTIFICATION COLOR
    // =================================================

    const getNotificationColor = (
        notification
    ) => {
        const type =
            getNotificationType(
                notification
            );

        if (
            type.includes("cancel")
        ) {
            return "error";
        }

        if (
            type.includes("completed") ||
            type.includes("success") ||
            type.includes("paid") ||
            type.includes("payment_received")
        ) {
            return "success";
        }

        if (
            type.includes("shipping") ||
            type.includes("shipped") ||
            type.includes("delivery")
        ) {
            return "primary";
        }

        if (
            type.includes("order") ||
            type.includes("placed")
        ) {
            return "warning";
        }

        return "info";
    };

    // =================================================
    // NOTIFICATION TITLE
    // =================================================

    const getNotificationTitle = (
        notification
    ) => {
        return (
            notification?.data?.title ||
            notification?.title ||
            notification?.data?.message ||
            notification?.message ||
            "New notification"
        );
    };

    // =================================================
    // NOTIFICATION MESSAGE
    // =================================================

    const getNotificationMessage = (
        notification
    ) => {
        return (
            notification?.data?.message ||
            notification?.message ||
            "You have a new notification."
        );
    };

    // =================================================
    // FORMAT DATE
    // =================================================

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const notificationDate =
            new Date(date);

        if (
            Number.isNaN(
                notificationDate.getTime()
            )
        ) {
            return "";
        }

        return notificationDate.toLocaleString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    // =================================================
    // LOADING STATE
    // =================================================

    if (loading) {
        return (
            <Card
                elevation={0}
                sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                    >
                        Recent Notifications
                    </Typography>

                    {[1, 2, 3, 4, 5].map(
                        (item) => (
                            <Box
                                key={item}
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 2,
                                    py: 1.5,
                                }}
                            >
                                <Skeleton
                                    variant="circular"
                                    width={45}
                                    height={45}
                                />

                                <Box
                                    sx={{
                                        flexGrow: 1,
                                    }}
                                >
                                    <Skeleton
                                        variant="text"
                                        width="70%"
                                        height={25}
                                    />

                                    <Skeleton
                                        variant="text"
                                        width="45%"
                                        height={20}
                                    />

                                    <Skeleton
                                        variant="text"
                                        width="30%"
                                        height={18}
                                    />
                                </Box>
                            </Box>
                        )
                    )}
                </CardContent>
            </Card>
        );
    }

    // =================================================
    // EMPTY STATE
    // =================================================

    if (
        notificationList.length === 0
    ) {
        return (
            <Card
                elevation={0}
                sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                    >
                        Recent Notifications
                    </Typography>

                    <Box
                        sx={{
                            minHeight: 180,
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            textAlign: "center",
                            color:
                                "text.secondary",
                        }}
                    >
                        <NotificationsIcon
                            sx={{
                                fontSize: 48,
                                mb: 1,
                                color:
                                    "text.disabled",
                            }}
                        />

                        <Typography
                            variant="body1"
                            fontWeight={500}
                        >
                            No notifications yet
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                        >
                            Your latest
                            notifications will
                            appear here.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                height: "100%",
            }}
        >
            <CardContent
                sx={{
                    p: 0,
                }}
            >
                {/* =====================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        px: 2.5,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 1,
                        }}
                    >
                        <NotificationsIcon
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Recent Notifications
                        </Typography>
                    </Box>

                    <Chip
                        label={`${notificationList.length} ${
                            notificationList.length ===
                            1
                                ? "notification"
                                : "notifications"
                        }`}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                <Divider />

                {/* =====================================
                    NOTIFICATION LIST
                ====================================== */}

                <List
                    disablePadding
                    sx={{
                        maxHeight: 420,
                        overflowY: "auto",
                    }}
                >
                    {notificationList.map(
                        (
                            notification,
                            index
                        ) => {
                            const color =
                                getNotificationColor(
                                    notification
                                );

                            const icon =
                                getNotificationIcon(
                                    notification
                                );

                            const title =
                                getNotificationTitle(
                                    notification
                                );

                            const message =
                                getNotificationMessage(
                                    notification
                                );

                            const date =
                                formatDate(
                                    notification?.created_at
                                );

                            const isUnread =
                                !notification?.read_at;

                            return (
                                <React.Fragment
                                    key={
                                        notification?.id ||
                                        index
                                    }
                                >
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            px: 2.5,
                                            py: 1.75,

                                            backgroundColor:
                                                isUnread
                                                    ? "#f8fbff"
                                                    : "transparent",

                                            transition:
                                                "background-color 0.2s",

                                            "&:hover":
                                                {
                                                    backgroundColor:
                                                        "#f5f5f5",
                                                },
                                        }}
                                    >
                                        {/* =================================
                                            ICON
                                        ================================== */}

                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor:
                                                        `${color}.main`,
                                                }}
                                            >
                                                {
                                                    icon
                                                }
                                            </Avatar>
                                        </ListItemAvatar>

                                        {/* =================================
                                            CONTENT
                                        ================================== */}

                                        <ListItemText
                                            primaryTypographyProps={{
                                                component:
                                                    "div",
                                            }}
                                            secondaryTypographyProps={{
                                                component:
                                                    "div",
                                            }}
                                            primary={
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        gap: 1,
                                                        width:
                                                            "100%",
                                                    }}
                                                >
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        fontWeight={
                                                            isUnread
                                                                ? 600
                                                                : 500
                                                        }
                                                        sx={{
                                                            minWidth: 0,
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {
                                                            title
                                                        }
                                                    </Typography>

                                                    {isUnread && (
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                minWidth: 8,
                                                                borderRadius:
                                                                    "50%",
                                                                bgcolor:
                                                                    "primary.main",
                                                                mt: 0.8,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        component="div"
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            overflow:
                                                                "hidden",
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {
                                                            message
                                                        }
                                                    </Typography>

                                                    {date && (
                                                        <Typography
                                                            component="div"
                                                            variant="caption"
                                                            color="text.disabled"
                                                            sx={{
                                                                display:
                                                                    "block",
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            {
                                                                date
                                                            }
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                            sx={{
                                                minWidth: 0,
                                                m: 0,
                                            }}
                                        />
                                    </ListItem>

                                    {/* =================================
                                        DIVIDER
                                    ================================== */}

                                    {index <
                                        notificationList.length -
                                            1 && (
                                        <Divider
                                            component="li"
                                        />
                                    )}
                                </React.Fragment>
                            );
                        }
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

// =====================================================
// EXPORT
// =====================================================

export default RecentNotifications;

