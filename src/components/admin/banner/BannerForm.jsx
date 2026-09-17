import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

const BannerForm = ({
    initialValues = null,
    loading = false,
    submitLabel = "Save Banner",
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        link: "",
        position: 0,
        status: true,
    });

    const [errors, setErrors] = useState({});

   useEffect(() => {
    if (!initialValues) return;

    setFormData({
        title: initialValues.title || "",
        image: initialValues.image || "",
        link: initialValues.link || "",
        position: initialValues.position ?? 0,
        status:
            initialValues.status === undefined
                ? true
                : Boolean(initialValues.status),
    });
}, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "position"
                    ? Number(value)
                    : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleStatusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.checked,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.image.trim()) {
            newErrors.image = "Banner image is required.";
        }

        if (
            formData.position !== "" &&
            Number(formData.position) < 0
        ) {
            newErrors.position =
                "Position cannot be negative.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        if (onSubmit) {
            onSubmit({
                title: formData.title,
                image: formData.image,
                link: formData.link,
                position: Number(formData.position),
                status: formData.status,
            });
        }
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
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Banner Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        required
                        label="Banner Image URL"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        error={Boolean(errors.image)}
                        helperText={errors.image}
                    />
                </Grid>

                {formData.image && (
                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                        >
                            Image Preview
                        </Typography>

                        <Box
                            component="img"
                            src={formData.image}
                            alt="Banner Preview"
                            sx={{
                                width: "100%",
                                maxWidth: 450,
                                height: 220,
                                objectFit: "cover",
                                borderRadius: 2,
                                border: "1px solid #ddd",
                            }}
                            onError={(e) => {
                                e.target.style.display =
                                    "none";
                            }}
                        />
                    </Grid>
                )}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Redirect Link"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        type="number"
                        label="Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        error={Boolean(errors.position)}
                        helperText={errors.position}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={
                                    formData.status
                                }
                                onChange={
                                    handleStatusChange
                                }
                            />
                        }
                        label={
                            formData.status
                                ? "Active"
                                : "Inactive"
                        }
                    />
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
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : submitLabel}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BannerForm;