// src/components/customer/checkout/ShippingAddress.jsx

import PropTypes from "prop-types";

import {
    Alert,
    Box,
    TextField,
    Typography,
} from "@mui/material";

import {
    LocationOn,
} from "@mui/icons-material";

const ShippingAddress = ({
    value,
    onChange,
    error = "",
    disabled = false,
}) => {
    return (
        <Box>

            {/* Header */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                }}
            >

                <LocationOn
                    color="primary"
                />

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Shipping Address
                </Typography>

            </Box>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 2,
                }}
            >
                Enter the complete address where
                you want your order delivered.
            </Typography>

            {/* Address */}

            <TextField
                fullWidth
                multiline
                minRows={4}
                label="Shipping Address"
                placeholder="House No, Street, Area, City, Province"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                error={Boolean(error)}
                helperText={
                    error ||
                    "Example: House 123, Street 5, Gulshan, Karachi, Sindh"
                }
                disabled={disabled}
                required
            />

            {/* Error */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

        </Box>
    );
};

ShippingAddress.propTypes = {
    value: PropTypes.string,

    onChange:
        PropTypes.func.isRequired,

    error:
        PropTypes.string,

    disabled:
        PropTypes.bool,
};

export default ShippingAddress;