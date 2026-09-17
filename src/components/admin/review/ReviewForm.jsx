import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

const ReviewForm = ({
    initialValues = {},
    loading = false,
    submitLabel = "Update Review",
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        status: "active",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            status:
                initialValues.status ||
                "active",
        });
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.status) {
            newErrors.status =
                "Status is required.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length ===
            0
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        onSubmit?.({
            status: formData.status,
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
        >
            <Grid
                container
                spacing={3}
            >
                {/* Customer */}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Customer"
                        value={
                            initialValues.user
                                ?.name || ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                {/* Product */}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Product"
                        value={
                            initialValues
                                .product
                                ?.name || ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                {/* Rating */}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Rating"
                        value={
                            initialValues.rating ??
                            ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                {/* Comment */}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Comment"
                        value={
                            initialValues.comment ||
                            ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                {/* Status */}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        select
                        fullWidth
                        name="status"
                        label="Review Status"
                        value={
                            formData.status
                        }
                        onChange={
                            handleChange
                        }
                        error={Boolean(
                            errors.status
                        )}
                        helperText={
                            errors.status
                        }
                    >
                        <MenuItem value="active">
                            Active
                        </MenuItem>

                        <MenuItem value="hidden">
                            Hidden
                        </MenuItem>

                        <MenuItem value="flagged">
                            Flagged
                        </MenuItem>
                    </TextField>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <Alert severity="info">
                        Only the review
                        status can be
                        updated by the
                        administrator.
                    </Alert>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading
                            }
                        >
                            {loading
                                ? "Updating..."
                                : submitLabel}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewForm;