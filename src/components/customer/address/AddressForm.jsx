import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";

import {
    HomeOutlined,
    SaveOutlined,
} from "@mui/icons-material";

const initialFormData = {
    name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Pakistan",
    type: "home",
    is_default: false,
};

const AddressForm = ({
    address = null,
    loading = false,
    error = null,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] =
        useState(initialFormData);

    const [errors, setErrors] = useState({});

    // =====================================================
    // LOAD ADDRESS WHEN EDITING
    // =====================================================

    useEffect(() => {
        if (address) {
            setFormData({
                name: address.name ?? "",
                phone: address.phone ?? "",
                address_line:
                    address.address_line ?? "",
                city: address.city ?? "",
                state: address.state ?? "",
                postal_code:
                    address.postal_code ?? "",
                country:
                    address.country ?? "Pakistan",
                type: address.type ?? "home",
                is_default:
                    Boolean(address.is_default),
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    }, [address]);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    // =====================================================
    // HANDLE CHECKBOX
    // =====================================================

    const handleDefaultChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            is_default: event.target.checked,
        }));
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {
        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name =
                "Receiver name is required.";
        }

        if (!formData.phone.trim()) {
            validationErrors.phone =
                "Phone number is required.";
        } else if (
            formData.phone.trim().length < 7
        ) {
            validationErrors.phone =
                "Enter a valid phone number.";
        }

        if (!formData.address_line.trim()) {
            validationErrors.address_line =
                "Address is required.";
        }

        if (!formData.city.trim()) {
            validationErrors.city =
                "City is required.";
        }

        if (!formData.country.trim()) {
            validationErrors.country =
                "Country is required.";
        }

        if (!formData.type) {
            validationErrors.type =
                "Address type is required.";
        }

        setErrors(validationErrors);

        return (
            Object.keys(validationErrors).length ===
            0
        );
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validate();

        if (!isValid) {
            return;
        }

        if (typeof onSubmit !== "function") {
            console.error(
                "AddressForm: onSubmit function is missing."
            );

            return;
        }

        try {
            await onSubmit(formData);
        } catch (submitError) {
            console.error(
                "Address form submit error:",
                submitError
            );
        }
    };

    // =====================================================
    // SERVER VALIDATION ERROR
    // =====================================================

    const getServerError = (field) => {
        if (!error) {
            return "";
        }

        if (typeof error === "object") {
            if (error[field]) {
                if (Array.isArray(error[field])) {
                    return error[field][0];
                }

                return error[field];
            }

            if (error.errors?.[field]) {
                if (
                    Array.isArray(
                        error.errors[field]
                    )
                ) {
                    return error.errors[field][0];
                }

                return error.errors[field];
            }
        }

        return "";
    };

    // =====================================================
    // FIELD ERROR
    // =====================================================

    const getFieldError = (field) => {
        return (
            errors[field] ||
            getServerError(field)
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                {/* SERVER ERROR */}

                {error &&
                    typeof error === "string" && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                {/* FORM */}

                <Grid
                    container
                    spacing={2.5}
                >
                    {/* NAME */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Receiver Name"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "name"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "name"
                                )
                            }
                            disabled={loading}
                            placeholder="Enter receiver name"
                        />
                    </Grid>

                    {/* PHONE */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Phone Number"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "phone"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "phone"
                                ) ||
                                "Example: 03001234567"
                            }
                            disabled={loading}
                            placeholder="03001234567"
                        />
                    </Grid>

                    {/* ADDRESS */}

                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            required
                            multiline
                            minRows={3}
                            label="Address"
                            name="address_line"
                            value={
                                formData.address_line
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "address_line"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "address_line"
                                )
                            }
                            disabled={loading}
                            placeholder="House no, street, area..."
                        />
                    </Grid>

                    {/* CITY */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="City"
                            name="city"
                            value={
                                formData.city
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "city"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "city"
                                )
                            }
                            disabled={loading}
                            placeholder="Karachi"
                        />
                    </Grid>

                    {/* STATE */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            label="State / Province"
                            name="state"
                            value={
                                formData.state
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "state"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "state"
                                )
                            }
                            disabled={loading}
                            placeholder="Sindh"
                        />
                    </Grid>

                    {/* POSTAL CODE */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            label="Postal Code"
                            name="postal_code"
                            value={
                                formData.postal_code
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "postal_code"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "postal_code"
                                )
                            }
                            disabled={loading}
                            placeholder="74000"
                        />
                    </Grid>

                    {/* COUNTRY */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Country"
                            name="country"
                            value={
                                formData.country
                            }
                            onChange={
                                handleChange
                            }
                            error={Boolean(
                                getFieldError(
                                    "country"
                                )
                            )}
                            helperText={
                                getFieldError(
                                    "country"
                                )
                            }
                            disabled={loading}
                        />
                    </Grid>

                    {/* ADDRESS TYPE */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <FormControl
                            fullWidth
                            required
                            error={Boolean(
                                getFieldError(
                                    "type"
                                )
                            )}
                            disabled={loading}
                        >
                            <InputLabel>
                                Address Type
                            </InputLabel>

                            <Select
                                name="type"
                                value={
                                    formData.type
                                }
                                label="Address Type"
                                onChange={
                                    handleChange
                                }
                            >
                                <MenuItem value="home">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <HomeOutlined fontSize="small" />
                                        <span>
                                            Home
                                        </span>
                                    </Stack>
                                </MenuItem>

                                <MenuItem value="office">
                                    Office
                                </MenuItem>
                            </Select>

                            {getFieldError(
                                "type"
                            ) && (
                                <FormHelperText>
                                    {getFieldError(
                                        "type"
                                    )}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* DEFAULT ADDRESS */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        formData.is_default
                                    }
                                    onChange={
                                        handleDefaultChange
                                    }
                                    disabled={
                                        loading
                                    }
                                />
                            }
                            label="Set as default address"
                        />
                    </Grid>

                    {/* BUTTONS */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Stack
                            direction={{
                                xs: "column-reverse",
                                sm: "row",
                            }}
                            justifyContent="flex-end"
                            spacing={2}
                        >
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={
                                        onCancel
                                    }
                                    disabled={
                                        loading
                                    }
                                    sx={{
                                        minWidth: 120,
                                        borderRadius: 2,
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={
                                                18
                                            }
                                            color="inherit"
                                        />
                                    ) : (
                                        <SaveOutlined />
                                    )
                                }
                                disabled={loading}
                                sx={{
                                    minWidth: 160,
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.2,
                                }}
                            >
                                {loading
                                    ? "Saving..."
                                    : address
                                    ? "Update Address"
                                    : "Save Address"}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </form>
    );
};

export default AddressForm;