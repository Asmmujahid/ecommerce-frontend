
// src/pages/Customer/Notifications/Notifications.jsx

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import DeleteIcon from
    "@mui/icons-material/Delete";

import DoneAllIcon from
    "@mui/icons-material/DoneAll";

import NotificationsIcon from
    "@mui/icons-material/Notifications";

import {
    deleteNotification,
    fetchNotifications,
    fetchUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    selectNotificationError,
    selectNotificationLoading,
    selectNotifications,
} from "../../../redux/notificationSlice";

// =====================================================
// COMPONENT
// =====================================================

const Notifications = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const notifications =
        useSelector(
            selectNotifications
        );

    const loading =
        useSelector(
            selectNotificationLoading
        );

    const error =
        useSelector(
            selectNotificationError
        );

    // =================================================
    // FETCH NOTIFICATIONS
    // =================================================

    useEffect(() => {
        dispatch(
            fetchNotifications({
                page: 1,
                perPage: 50,
            })
        );

        dispatch(
            fetchUnreadCount()
        );
    }, [dispatch]);

    // =================================================
    // GET NOTIFICATION URL
    // =================================================

    const getNotificationUrl = (
        notification
    ) => {
        const data =
            notification?.data ||
            {};

        if (data.action_url) {
            return data.action_url;
        }

        if (data.order_id) {
            return `/customer/orders/${data.order_id}`;
        }

        return "/customer/notifications";
    };

    // =================================================
    // CLICK NOTIFICATION
    // =================================================

    const handleNotificationClick =
        async (
            notification
        ) => {
            try {
                if (
                    !notification.read_at
                ) {
                    await dispatch(
                        markNotificationAsRead(
                            notification.id
                        )
                    ).unwrap();

                    dispatch(
                        fetchUnreadCount()
                    );
                }
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

            if (url) {
                navigate(url);
            }
        };

    // =================================================
    // DELETE ONE NOTIFICATION
    // =================================================

    const handleDelete = async (
        event,
        id
    ) => {
        event.stopPropagation();

        try {
            await dispatch(
                deleteNotification(id)
            ).unwrap();

            dispatch(
                fetchUnreadCount()
            );
        } catch (error) {
            console.error(
                "Failed to delete notification:",
                error
            );
        }
    };

    // =================================================
    // MARK ALL AS READ
    // =================================================

    const handleMarkAllRead =
        async () => {
            try {
                await dispatch(
                    markAllNotificationsAsRead()
                ).unwrap();

                dispatch(
                    fetchUnreadCount()
                );
            } catch (error) {
                console.error(
                    "Failed to mark all notifications:",
                    error
                );
            }
        };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",

                backgroundColor:
                    "background.default",

                py: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
            }}
        >
            <Container maxWidth="md">
                {/* =================================================
                    HEADER
                ================================================= */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                    spacing={2}
                    mb={3}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <NotificationsIcon
                            color="primary"
                            fontSize="large"
                        />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Notifications
                            </Typography>

                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                View your latest
                                account and order
                                notifications.
                            </Typography>
                        </Box>
                    </Stack>

                    {notifications.length >
                        0 && (
                        <Button
                            variant="outlined"
                            startIcon={
                                <DoneAllIcon />
                            }
                            onClick={
                                handleMarkAllRead
                            }
                        >
                            Mark all as read
                        </Button>
                    )}
                </Stack>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (
                    <Box
                        sx={{
                            display:
                                "flex",

                            justifyContent:
                                "center",

                            py: 8,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : notifications.length ===
                  0 ? (
                    /* =================================================
                       EMPTY STATE
                    ================================================= */

                    <Card>
                        <CardContent
                            sx={{
                                py: 8,

                                textAlign:
                                    "center",
                            }}
                        >
                            <NotificationsIcon
                                sx={{
                                    fontSize: 60,

                                    color:
                                        "text.disabled",

                                    mb: 2,
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                No notifications
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                You don't have any
                                notifications yet.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    /* =================================================
                       NOTIFICATION LIST
                    ================================================= */

                    <Card>
                        {notifications.map(
                            (
                                notification,
                                index
                            ) => {
                                const data =
                                    notification.data ||
                                    {};

                                const unread =
                                    !notification.read_at;

                                return (
                                    <Box
                                        key={
                                            notification.id
                                        }
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                        sx={{
                                            cursor:
                                                "pointer",

                                            px: {
                                                xs: 2,
                                                sm: 3,
                                            },

                                            py: 2,

                                            backgroundColor:
                                                unread
                                                    ? "action.hover"
                                                    : "transparent",

                                            transition:
                                                "background-color 0.2s",

                                            "&:hover":
                                                {
                                                    backgroundColor:
                                                        "action.selected",
                                                },
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="flex-start"
                                        >
                                            {/* ICON */}

                                            <Box
                                                sx={{
                                                    width: 42,

                                                    height: 42,

                                                    borderRadius:
                                                        "50%",

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "center",

                                                    backgroundColor:
                                                        unread
                                                            ? "primary.main"
                                                            : "action.disabledBackground",

                                                    color:
                                                        unread
                                                            ? "primary.contrastText"
                                                            : "text.secondary",

                                                    flexShrink: 0,
                                                }}
                                            >
                                                <NotificationsIcon />
                                            </Box>

                                            {/* CONTENT */}

                                            <Box
                                                sx={{
                                                    flex: 1,

                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={
                                                        unread
                                                            ? 700
                                                            : 600
                                                    }
                                                >
                                                    {data.title ||
                                                        "Notification"}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {data.message ||
                                                        "You have a new notification."}
                                                </Typography>

                                                {/* OPTIONAL ORDER */}

                                                {data.order_number && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display:
                                                                "block",

                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        Order: #
                                                        {
                                                            data.order_number
                                                        }
                                                    </Typography>
                                                )}

                                                {/* DATE */}

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        display:
                                                            "block",

                                                        mt: 1,
                                                    }}
                                                >
                                                    {notification.created_at
                                                        ? new Date(
                                                              notification.created_at
                                                          ).toLocaleString()
                                                        : ""}
                                                </Typography>
                                            </Box>

                                            {/* DELETE */}

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
                                                aria-label="delete notification"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>

                                        {/* DIVIDER */}

                                        {index <
                                            notifications.length -
                                                1 && (
                                            <Divider
                                                sx={{
                                                    mt: 2,
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            }
                        )}
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default Notifications;

