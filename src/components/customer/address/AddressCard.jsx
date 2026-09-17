import React from "react";

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    DeleteOutline,
    EditOutlined,
    HomeOutlined,
    BusinessOutlined,
    PhoneOutlined,
    LocationOnOutlined,
} from "@mui/icons-material";

const AddressCard = ({
    address,
    onEdit,
    onDelete,
}) => {
    if (!address) {
        return null;
    }

    const {
        id,
        name,
        phone,
        address_line,
        city,
        state,
        postal_code,
        country,
        type,
        is_default,
    } = address;

    const isHome = type === "home";

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                border: "1px solid",
                borderColor: is_default
                    ? "primary.main"
                    : "divider",
                borderRadius: 3,
                position: "relative",
                transition: "all 0.2s ease",

                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                },
            }}
        >
            {/* Default Badge */}

            {is_default && (
                <Chip
                    label="Default"
                    color="primary"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontWeight: 600,
                    }}
                />
            )}

            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                }}
            >
                {/* Header */}

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        mb: 2,
                        pr: is_default ? 9 : 0,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    "primary.50",
                                color: "primary.main",
                            }}
                        >
                            {isHome ? (
                                <HomeOutlined />
                            ) : (
                                <BusinessOutlined />
                            )}
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                {name || "Address"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    textTransform:
                                        "capitalize",
                                }}
                            >
                                {type || "home"}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Phone */}

                {phone && (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        sx={{
                            mb: 1.5,
                        }}
                    >
                        <PhoneOutlined
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {phone}
                        </Typography>
                    </Stack>
                )}

                {/* Address */}

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{
                        mb: 2,
                    }}
                >
                    <LocationOnOutlined
                        fontSize="small"
                        color="action"
                    />

                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: 1.6,
                            }}
                        >
                            {address_line}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.6,
                            }}
                        >
                            {city}
                            {state
                                ? `, ${state}`
                                : ""}
                            {postal_code
                                ? ` - ${postal_code}`
                                : ""}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {country}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                {/* Actions */}

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={0.5}
                >
                    <Tooltip title="Edit address">
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                                if (onEdit) {
                                    onEdit(address);
                                }
                            }}
                            aria-label="Edit address"
                        >
                            <EditOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete address">
                        <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                                if (onDelete) {
                                    onDelete(address);
                                }
                            }}
                            aria-label="Delete address"
                        >
                            <DeleteOutline fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default AddressCard;