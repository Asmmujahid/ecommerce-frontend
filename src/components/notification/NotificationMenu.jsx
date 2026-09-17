
// src/components/notification/NotificationMenu.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import {
    deleteNotification,
    fetchNotifications,
    fetchUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    selectNotificationLoading,
    selectNotifications,
} from "../../redux/notificationSlice";

const NotificationMenu = ({
    anchorEl,
    open,
    onClose,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =====================================================
    // REDUX STATE
    // =====================================================

    const notifications = useSelector(
        selectNotifications
    );

    const loading = useSelector(
        selectNotificationLoading
    );

    // =====================================================
    // GET CURRENT USER / ROLE
    // =====================================================

    const storedUser =
        localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        user = null;
    }

    const role =
        user?.roles?.[0]?.name ||
        user?.role ||
        localStorage.getItem("role") ||
        "";

    // =====================================================
    // FETCH NOTIFICATIONS WHEN MENU OPENS
    // =====================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        dispatch(
            fetchNotifications({
                page: 1,
                perPage: 10,
            })
        );

        dispatch(fetchUnreadCount());
    }, [dispatch, open]);

    // =====================================================
    // GET NOTIFICATION URL
    // =====================================================

    const getNotificationUrl = (
        notification
    ) => {
        const actionUrl =
            notification?.data?.action_url;

        if (actionUrl) {
            return actionUrl;
        }

        const orderId =
            notification?.data?.order_id;

        if (orderId) {
            switch (role) {
                case "admin":
                    return `/admin/orders/${orderId}`;

                case "seller":
                    return `/seller/orders/${orderId}`;

                case "customer":
                    return `/customer/orders/${orderId}`;

                default:
                    return `/orders/${orderId}`;
            }
        }

        switch (role) {
            case "admin":
                return "/admin/notifications";

            case "seller":
                return "/seller/notifications";

            case "customer":
                return "/customer/notifications";

            default:
                return "/notifications";
        }
    };

    // =====================================================
    // CLICK NOTIFICATION
    // =====================================================

    const handleNotificationClick = async (
        notification
    ) => {
        try {
            if (!notification?.read_at) {
                await dispatch(
                    markNotificationAsRead(
                        notification.id
                    )
                ).unwrap();
            }

            dispatch(fetchUnreadCount());
        } catch (error) {
            console.error(
                "Failed to mark notification:",
                error
            );
        }

        const url =
            getNotificationUrl(
                notification
            );

        onClose();

        if (url) {
            navigate(url);
        }
    };

    // =====================================================
    // DELETE ONE NOTIFICATION
    // =====================================================

    const handleDelete = async (
        event,
        notificationId
    ) => {
        event.stopPropagation();

        try {
            await dispatch(
                deleteNotification(
                    notificationId
                )
            ).unwrap();

            dispatch(fetchUnreadCount());
        } catch (error) {
            console.error(
                "Failed to delete notification:",
                error
            );
        }
    };

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const handleMarkAllRead = async () => {
        try {
            await dispatch(
                markAllNotificationsAsRead()
            ).unwrap();

            await dispatch(
                fetchNotifications({
                    page: 1,
                    perPage: 10,
                })
            );

            dispatch(fetchUnreadCount());
        } catch (error) {
            console.error(
                "Failed to mark all notifications:",
                error
            );
        }
    };

    // =====================================================
    // VIEW ALL URL
    // =====================================================

    const getViewAllUrl = () => {
        switch (role) {
            case "admin":
                return "/admin/notifications";

            case "seller":
                return "/seller/notifications";

            case "customer":
                return "/customer/notifications";

            default:
                return "/notifications";
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatNotificationDate = (
        date
    ) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleString();
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}

            // =================================================
            // IMPORTANT FIX
            // =================================================
            // MUI calculates the available viewport height.
            // maxHeight is now responsive instead of fixed.
            // This prevents:
            //
            // "The popover component is too tall."
            //
            PaperProps={{
                sx: {
                    width: {
                        xs: "calc(100vw - 24px)",
                        sm: 420,
                    },

                    maxWidth:
                        "calc(100vw - 24px)",

                    // Responsive maximum height
                    maxHeight:
                        "calc(100vh - 100px)",

                    // Never allow content to overflow
                    overflowY: "auto",

                    // Keep menu inside viewport
                    boxSizing: "border-box",
                },
            }}

            MenuListProps={{
                sx: {
                    py: 0,
                },
            }}

            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}

            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}

            // Prevent the menu from becoming wider than viewport
            marginThreshold={8}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor:
                        "background.paper",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Notifications
                    </Typography>

                    {notifications.length >
                        0 && (
                        <Button
                            size="small"
                            startIcon={
                                <DoneAllIcon />
                            }
                            onClick={
                                handleMarkAllRead
                            }
                        >
                            Mark all read
                        </Button>
                    )}
                </Stack>
            </Box>

            <Divider />

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                        py: 5,
                    }}
                >
                    <CircularProgress
                        size={28}
                    />
                </Box>
            ) : notifications.length ===
              0 ? (
                // =================================================
                // EMPTY STATE
                // =================================================

                <Box
                    sx={{
                        px: 3,
                        py: 5,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        color="text.secondary"
                    >
                        No notifications
                    </Typography>
                </Box>
            ) : (
                // =================================================
                // NOTIFICATION LIST
                // =================================================

                notifications.map(
                    (notification) => {
                        const data =
                            notification?.data ||
                            {};

                        const isUnread =
                            !notification?.read_at;

                        return (
                            <MenuItem
                                key={
                                    notification.id
                                }
                                onClick={() =>
                                    handleNotificationClick(
                                        notification
                                    )
                                }
                                sx={{
                                    alignItems:
                                        "flex-start",

                                    py: 1.5,

                                    px: 2,

                                    minHeight: "auto",

                                    backgroundColor:
                                        isUnread
                                            ? "action.hover"
                                            : "transparent",

                                    borderLeft:
                                        isUnread
                                            ? "3px solid"
                                            : "3px solid transparent",

                                    borderColor:
                                        "primary.main",

                                    whiteSpace:
                                        "normal",

                                    "&:hover": {
                                        backgroundColor:
                                            "action.selected",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "100%",
                                        minWidth: 0,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        spacing={1}
                                    >
                                        {/* =====================================
                                            CONTENT
                                        ===================================== */}

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                                flex: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight={
                                                    isUnread
                                                        ? 700
                                                        : 500
                                                }
                                                sx={{
                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {data.title ||
                                                    "Notification"}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mt: 0.5,

                                                    display:
                                                        "-webkit-box",

                                                    WebkitLineClamp: 3,

                                                    WebkitBoxOrient:
                                                        "vertical",

                                                    overflow:
                                                        "hidden",

                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {data.message ||
                                                    "You have a new notification."}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display:
                                                        "block",

                                                    mt: 0.5,
                                                }}
                                            >
                                                {formatNotificationDate(
                                                    notification.created_at
                                                )}
                                            </Typography>
                                        </Box>

                                        {/* =====================================
                                            DELETE BUTTON
                                        ===================================== */}

                                        <IconButton
                                            size="small"
                                            onClick={(
                                                event
                                            ) =>
                                                handleDelete(
                                                    event,
                                                    notification.id
                                                )
                                            }
                                            sx={{
                                                flexShrink: 0,
                                            }}
                                            aria-label="Delete notification"
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </MenuItem>
                        );
                    }
                )
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <Divider />

            <Box
                sx={{
                    px: 2,
                    py: 1,
                    position: "sticky",
                    bottom: 0,
                    zIndex: 1,
                    backgroundColor:
                        "background.paper",
                }}
            >
                <Button
                    fullWidth
                    onClick={() => {
                        onClose();

                        navigate(
                            getViewAllUrl()
                        );
                    }}
                >
                    View All Notifications
                </Button>
            </Box>
        </Menu>
    );
};

export default NotificationMenu;

