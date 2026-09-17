import {
    useEffect,
    useState,
} from "react";

import PropTypes from "prop-types";

import {
    Box,
    Button,
    Grid,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";

const ReturnRequestForm = ({
    initialValues = {},
    loading = false,
    submitLabel = "Update Return Request",
    onSubmit,
}) => {
    const [formData, setFormData] =
        useState({
            status: "pending",
            refund_amount: "",
            admin_note: "",
        });

    const [errors, setErrors] =
        useState({});

    useEffect(() => {
        setFormData({
            status:
                initialValues?.status ||
                "pending",

            refund_amount:
                initialValues?.refund_amount ??
                "",

            admin_note:
                initialValues?.admin_note ||
                "",
        });

        setErrors({});
    }, [initialValues]);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.status) {
            newErrors.status =
                "Status is required.";
        }

        if (
            formData.refund_amount !== "" &&
            Number(formData.refund_amount) < 0
        ) {
            newErrors.refund_amount =
                "Refund amount cannot be negative.";
        }

        if (
            formData.status === "refunded" &&
            formData.refund_amount === ""
        ) {
            newErrors.refund_amount =
                "Refund amount is required when status is refunded.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit({
            status: formData.status,

            refund_amount:
                formData.refund_amount === ""
                    ? null
                    : Number(
                          formData.refund_amount
                      ),

            admin_note:
                formData.admin_note.trim(),
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
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        select
                        fullWidth
                        required
                        label="Status"
                        name="status"
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
                        <MenuItem value="pending">
                            Pending
                        </MenuItem>

                        <MenuItem value="approved">
                            Approved
                        </MenuItem>

                        <MenuItem value="rejected">
                            Rejected
                        </MenuItem>

                        <MenuItem value="refunded">
                            Refunded
                        </MenuItem>
                    </TextField>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        type="number"
                        label="Refund Amount"
                        name="refund_amount"
                        value={
                            formData.refund_amount
                        }
                        onChange={
                            handleChange
                        }
                        error={Boolean(
                            errors.refund_amount
                        )}
                        helperText={
                            errors.refund_amount
                        }
                        inputProps={{
                            min: 0,
                            step: "0.01",
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Admin Note"
                        name="admin_note"
                        value={
                            formData.admin_note
                        }
                        onChange={
                            handleChange
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

ReturnRequestForm.propTypes = {
    initialValues: PropTypes.object,
    loading: PropTypes.bool,
    submitLabel: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
};

export default ReturnRequestForm;