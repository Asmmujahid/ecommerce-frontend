import { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    Typography,
} from "@mui/material";

const VendorForm = ({
    vendor = null,
    isEdit = false,
    onSubmit,
}) => {

    const [formData, setFormData] = useState({
        store_name: "",
        description: "",
        phone: "",
        address: "",
        logo: "",
        banner: "",
        status: true,
    });

    // =====================================
    // Load Vendor Data
    // =====================================

    useEffect(() => {

        if (vendor) {

            setFormData({

                store_name:
                    vendor.store_name || "",

                description:
                    vendor.description || "",

                phone:
                    vendor.phone || "",

                address:
                    vendor.address || "",

                logo:
                    vendor.logo || "",

                banner:
                    vendor.banner || "",

                status:
                    Boolean(vendor.status),

            });

        }

    }, [vendor]);

    // =====================================
    // Handle Change
    // =====================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:
                name === "status"
                    ? value === "true"
                    : value,

        }));

    };

    // =====================================
    // Submit
    // =====================================

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (

        <Box
            component="form"
            onSubmit={handleSubmit}
        >

            <Grid container spacing={3}>

                {/* Store Name */}

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        required
                        label="Store Name"
                        name="store_name"
                        value={formData.store_name}
                        onChange={handleChange}
                    />

                </Grid>

                {/* Description */}

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                </Grid>

                {/* Phone */}

                <Grid item xs={12} md={6}>

                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                </Grid>

                {/* Status */}

                <Grid item xs={12} md={6}>

                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={String(formData.status)}
                        onChange={handleChange}
                    >

                        <MenuItem value="true">
                            Approved
                        </MenuItem>

                        <MenuItem value="false">
                            Pending
                        </MenuItem>

                    </TextField>

                </Grid>

                {/* Address */}

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                </Grid>

                {/* Logo */}

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        label="Logo URL"
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                    />

                </Grid>

                {formData.logo && (

                    <Grid item xs={12}>

                        <Typography mb={1}>
                            Logo Preview
                        </Typography>

                        <img
                            src={formData.logo}
                            alt="Logo"
                            style={{
                                width: 140,
                                borderRadius: 8,
                                border: "1px solid #ddd",
                            }}
                        />

                    </Grid>

                )}

                {/* Banner */}

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        label="Banner URL"
                        name="banner"
                        value={formData.banner}
                        onChange={handleChange}
                    />

                </Grid>

                {formData.banner && (

                    <Grid item xs={12}>

                        <Typography mb={1}>
                            Banner Preview
                        </Typography>

                        <img
                            src={formData.banner}
                            alt="Banner"
                            style={{
                                width: "100%",
                                maxWidth: 500,
                                borderRadius: 10,
                                border: "1px solid #ddd",
                            }}
                        />

                    </Grid>

                )}

                {/* Submit */}

                <Grid item xs={12}>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        {isEdit
                            ? "Update Vendor"
                            : "Save Vendor"}
                    </Button>

                </Grid>

            </Grid>

        </Box>

    );

};

export default VendorForm;