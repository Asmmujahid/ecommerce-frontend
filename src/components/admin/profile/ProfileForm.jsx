import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Avatar,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

const ProfileForm = ({
    profile,
    loading = false,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        avatar: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                avatar: profile.avatar || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
        >
            <Stack
                spacing={3}
            >
                <Stack
                    alignItems="center"
                    spacing={2}
                >
                    <Avatar
                        src={
                            formData.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                formData.name || "Admin"
                            )}&background=1976d2&color=fff`
                        }
                        sx={{
                            width: 110,
                            height: 110,
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Admin Profile
                    </Typography>
                </Stack>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            type="email"
                            label="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Avatar URL"
                            name="avatar"
                            placeholder="https://example.com/avatar.jpg"
                            value={formData.avatar}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Box
                    display="flex"
                    justifyContent="flex-end"
                >
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Profile"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

ProfileForm.propTypes = {
    profile: PropTypes.object,

    loading: PropTypes.bool,

    onSubmit: PropTypes.func.isRequired,
};

export default ProfileForm;