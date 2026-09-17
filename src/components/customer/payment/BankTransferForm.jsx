// src/components/customer/payment/BankTransferForm.jsx

import PropTypes from "prop-types";

import {
    Alert,
    Box,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    AccountBalance,
    ReceiptLong,
} from "@mui/icons-material";

// =====================================================
// COMPONENT
// =====================================================

const BankTransferForm = ({
    transactionId = "",
    onTransactionIdChange,
    disabled = false,
}) => {
    const handleChange = (event) => {
        if (
            typeof onTransactionIdChange ===
            "function"
        ) {
            onTransactionIdChange(
                event.target.value
            );
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                mt: 2,
                p: 2.5,
                borderRadius: 2,
                opacity: disabled ? 0.6 : 1,
            }}
        >
            <Stack spacing={2.5}>
                {/* HEADER */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <AccountBalance color="primary" />

                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                        >
                            Bank Transfer Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Transfer the order amount
                            to the following bank
                            account.
                        </Typography>
                    </Box>
                </Stack>

                <Divider />

                {/* BANK DETAILS */}

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "grey.50",
                    }}
                >
                    <Stack spacing={1}>
                        <Typography>
                            <strong>Bank:</strong>{" "}
                            HBL Bank
                        </Typography>

                        <Typography>
                            <strong>
                                Account Title:
                            </strong>{" "}
                            E-Commerce Store
                        </Typography>

                        <Typography>
                            <strong>
                                Account Number:
                            </strong>{" "}
                            1234567890
                        </Typography>

                        <Typography>
                            <strong>IBAN:</strong>{" "}
                            PK00HABB0000001234567890
                        </Typography>
                    </Stack>
                </Box>

                {/* INSTRUCTION */}

                <Alert severity="info">
                    After transferring the amount,
                    enter your bank
                    transaction/reference number
                    below.
                </Alert>

                {/* TRANSACTION ID */}

                <TextField
                    fullWidth
                    label="Bank Transaction / Reference Number"
                    placeholder="Enter transaction reference"
                    value={transactionId}
                    onChange={handleChange}
                    disabled={disabled}
                    required
                    error={
                        !disabled &&
                        !transactionId.trim()
                    }
                    InputProps={{
                        startAdornment: (
                            <ReceiptLong
                                sx={{
                                    mr: 1,
                                    color:
                                        "text.secondary",
                                }}
                            />
                        ),
                    }}
                    helperText="This number is used to verify your bank transfer."
                />
            </Stack>
        </Paper>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

BankTransferForm.propTypes = {
    transactionId: PropTypes.string,

    onTransactionIdChange:
        PropTypes.func.isRequired,

    disabled: PropTypes.bool,
};

// =====================================================
// EXPORT
// =====================================================

export default BankTransferForm;