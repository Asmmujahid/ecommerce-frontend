// src/components/admin/coupon/CouponForm.jsx

import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

const CouponForm = ({
    formData,
    setFormData,
    onSubmit,
    loading = false,
}) => {
    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // HANDLE COUPON TYPE
    // =====================================================

    const handleTypeChange = (e) => {
        const type = e.target.value;

        setFormData((prev) => ({
            ...prev,
            type,

            // Maximum discount only applies
            // to percentage coupons.
            max_discount:
                type === "percentage"
                    ? prev.max_discount
                    : "",
        }));
    };

    // =====================================================
    // HANDLE ADMIN COUPON SCOPE
    // =====================================================

    const handleScopeChange = (e) => {
        const admin_coupon_scope = e.target.value;

        setFormData((prev) => ({
            ...prev,
            admin_coupon_scope,
        }));
    };

    // =====================================================
    // HANDLE STATUS
    // =====================================================

    const handleStatusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.checked,
        }));
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
        >
            <Stack spacing={3}>

                {/* =================================================
                    TITLE
                ================================================= */}

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Coupon Information
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    {/* =================================================
                        COUPON CODE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Coupon Code"
                            name="code"
                            value={formData.code || ""}
                            onChange={handleChange}
                            placeholder="SAVE20"
                            inputProps={{
                                maxLength: 50,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        COUPON TYPE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            select
                            fullWidth
                            required
                            label="Coupon Type"
                            name="type"
                            value={
                                formData.type ||
                                "percentage"
                            }
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="percentage">
                                Percentage
                            </MenuItem>

                            <MenuItem value="fixed">
                                Fixed Amount
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* =================================================
                        ADMIN COUPON SCOPE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            select
                            fullWidth
                            required
                            label="Coupon Scope"
                            name="admin_coupon_scope"
                            value={
                                formData.admin_coupon_scope ||
                                "admin_only"
                            }
                            onChange={handleScopeChange}
                            helperText={
                                formData.admin_coupon_scope ===
                                "admin_only"
                                    ? "This coupon applies only to products owned by the admin."
                                    : "This coupon applies to all products, including vendor products."
                            }
                        >
                            <MenuItem value="admin_only">
                                Admin Products Only
                            </MenuItem>

                            <MenuItem value="all_products">
                                All Products
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* =================================================
                        VALUE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label={
                                formData.type ===
                                "percentage"
                                    ? "Discount (%)"
                                    : "Discount Amount"
                            }
                            name="value"
                            value={
                                formData.value ?? ""
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                max:
                                    formData.type ===
                                    "percentage"
                                        ? 100
                                        : undefined,
                                step: "0.01",
                            }}
                            helperText={
                                formData.type ===
                                "percentage"
                                    ? "Enter a percentage between 0 and 100."
                                    : "Enter the fixed discount amount."
                            }
                        />
                    </Grid>

                    {/* =================================================
                        MINIMUM ORDER AMOUNT
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Minimum Order Amount"
                            name="min_order_amount"
                            value={
                                formData.min_order_amount ??
                                ""
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                            helperText="Optional"
                        />
                    </Grid>

                    {/* =================================================
                        MAXIMUM DISCOUNT
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Maximum Discount"
                            name="max_discount"
                            value={
                                formData.max_discount ??
                                ""
                            }
                            onChange={handleChange}
                            disabled={
                                formData.type !==
                                "percentage"
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                            helperText={
                                formData.type ===
                                "percentage"
                                    ? "Optional maximum discount."
                                    : "Only used for percentage coupons."
                            }
                        />
                    </Grid>

                    {/* =================================================
                        USAGE LIMIT
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Usage Limit"
                            name="usage_limit"
                            value={
                                formData.usage_limit ??
                                ""
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 1,
                                step: 1,
                            }}
                            helperText="Optional"
                        />
                    </Grid>

                    {/* =================================================
                        START DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="Start Date"
                            name="start_date"
                            value={
                                formData.start_date ||
                                ""
                            }
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                max:
                                    formData.end_date ||
                                    undefined,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        END DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="End Date"
                            name="end_date"
                            value={
                                formData.end_date ||
                                ""
                            }
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min:
                                    formData.start_date ||
                                    undefined,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={Boolean(
                                        formData.status
                                    )}
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

                </Grid>

                {/* =================================================
                    SUBMIT BUTTON
                ================================================= */}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : "Save Coupon"}
                </Button>

            </Stack>
        </Box>
    );
};

export default CouponForm;