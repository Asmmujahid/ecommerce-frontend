// src/components/customer/payment/PaymentMethod.jsx

import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";

import {
    AccountBalanceWallet,
    CreditCard,
    Payments,
} from "@mui/icons-material";

// =====================================================
// PAYMENT METHODS
// =====================================================

const PAYMENT_METHODS = [
    {
        value: "cod",
        label: "Cash on Delivery",
        description:
            "Pay when your order is delivered.",
        icon: <Payments />,
    },
    {
        value: "bank_transfer",
        label: "Bank Transfer",
        description:
            "Pay directly through your bank account.",
        icon: <AccountBalanceWallet />,
    },
    {
        value: "card",
        label: "Credit / Debit Card",
        description:
            "Pay securely using your card.",
        icon: <CreditCard />,
    },
];

// =====================================================
// COMPONENT
// =====================================================

const PaymentMethod = ({
    value = "cod",
    onChange,
    disabled = false,
}) => {
    const handleChange = (event) => {
        if (disabled) {
            return;
        }

        const selectedValue = event.target.value;

        if (typeof onChange === "function") {
            onChange(selectedValue);
        }
    };

    return (
        <Box>
            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Payment Method
            </Typography>

            <RadioGroup
                value={value}
                onChange={handleChange}
            >
                {PAYMENT_METHODS.map((method) => {
                    const selected =
                        value === method.value;

                    return (
                        <Card
                            key={method.value}
                            variant="outlined"
                            elevation={0}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                borderWidth:
                                    selected ? 2 : 1,
                                borderStyle: "solid",
                                borderColor:
                                    selected
                                        ? "primary.main"
                                        : "divider",
                                backgroundColor:
                                    selected
                                        ? "primary.50"
                                        : "background.paper",
                                opacity:
                                    disabled ? 0.6 : 1,
                                transition:
                                    "all 0.2s ease",
                                "&:hover": {
                                    borderColor:
                                        disabled
                                            ? "divider"
                                            : "primary.main",
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 0,
                                    "&:last-child": {
                                        pb: 0,
                                    },
                                }}
                            >
                                <FormControlLabel
                                    value={method.value}
                                    disabled={disabled}
                                    control={<Radio />}
                                    sx={{
                                        width: "100%",
                                        m: 0,
                                        p: 2,
                                        alignItems:
                                            "flex-start",
                                    }}
                                    label={
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "flex-start",
                                                gap: 1.5,
                                                pt: 0.25,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius:
                                                        1.5,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    flexShrink: 0,
                                                    backgroundColor:
                                                        selected
                                                            ? "primary.main"
                                                            : "grey.100",
                                                    color:
                                                        selected
                                                            ? "white"
                                                            : "text.secondary",
                                                }}
                                            >
                                                {
                                                    method.icon
                                                }
                                            </Box>

                                            <Box>
                                                <Typography
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    {
                                                        method.label
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {
                                                        method.description
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </CardContent>
                        </Card>
                    );
                })}
            </RadioGroup>
        </Box>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

PaymentMethod.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

// =====================================================
// EXPORT
// =====================================================

export default PaymentMethod;