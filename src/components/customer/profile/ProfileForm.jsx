// src/components/customer/profile/ProfileForm.jsx

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

// =====================================================
// COMPONENT
// =====================================================

const ProfileForm = ({
    formData,
    updating,
    validationErrors = {},
    onChange,
    onSubmit,
}) => {
    return (
        <Card
            sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow:
                    "0 2px 10px rgba(0,0,0,0.06)",
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Personal Information
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    Update your personal
                    information below.
                </Typography>

                <Divider
                    sx={{
                        my: 3,
                    }}
                />

                <Box
                    component="form"
                    onSubmit={onSubmit}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        {/* =================================================
                            NAME
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                required
                                label="Full Name"
                                name="name"
                                value={
                                    formData.name || ""
                                }
                                onChange={
                                    onChange
                                }
                                error={Boolean(
                                    validationErrors
                                        ?.name
                                )}
                                helperText={
                                    validationErrors
                                        ?.name?.[0] ||
                                    ""
                                }
                            />
                        </Grid>

                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Email"
                                name="email"
                                value={
                                    formData.email ||
                                    ""
                                }
                                onChange={
                                    onChange
                                }
                                error={Boolean(
                                    validationErrors
                                        ?.email
                                )}
                                helperText={
                                    validationErrors
                                        ?.email?.[0] ||
                                    ""
                                }
                            />
                        </Grid>

                        {/* =================================================
                            PHONE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={
                                    formData.phone ||
                                    ""
                                }
                                onChange={
                                    onChange
                                }
                                error={Boolean(
                                    validationErrors
                                        ?.phone
                                )}
                                helperText={
                                    validationErrors
                                        ?.phone?.[0] ||
                                    ""
                                }
                            />
                        </Grid>

                        {/* =================================================
                            AVATAR
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Avatar URL"
                                name="avatar"
                                value={
                                    formData.avatar ||
                                    ""
                                }
                                onChange={
                                    onChange
                                }
                                error={Boolean(
                                    validationErrors
                                        ?.avatar
                                )}
                                helperText={
                                    validationErrors
                                        ?.avatar?.[0] ||
                                    ""
                                }
                            />
                        </Grid>
                    </Grid>

                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        sx={{
                            mt: 3,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={updating}
                            startIcon={
                                updating ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : (
                                    <SaveIcon />
                                )
                            }
                        >
                            {updating
                                ? "Updating..."
                                : "Update Profile"}
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfileForm;