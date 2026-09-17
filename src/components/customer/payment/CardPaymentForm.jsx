// src/components/customer/payment/CardPaymentForm.jsx

import PropTypes from "prop-types";

import {
    Alert,
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    CreditCard,
    Lock,
} from "@mui/icons-material";

// =====================================================
// COMPONENT
// =====================================================

const CardPaymentForm = ({
    disabled = false,
}) => {
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
            <Stack spacing={2}>
                {/* HEADER */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                                "primary.main",
                            color: "white",
                        }}
                    >
                        <CreditCard />
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                        >
                            Credit / Debit Card
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Secure card payment
                        </Typography>
                    </Box>
                </Stack>

                {/* SECURITY MESSAGE */}

                <Alert
                    severity="info"
                    icon={<Lock />}
                >
                    Card details are processed
                    securely through a payment
                    gateway. Your card number,
                    expiry date and CVV are not
                    stored in our Laravel database.
                </Alert>

                {/* CURRENT STATUS */}

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor:
                            "grey.50",
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>
                            Card gateway:
                        </strong>{" "}
                        Not connected yet
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        The order will be created
                        with a{" "}
                        <strong>pending</strong>{" "}
                        payment until a payment
                        gateway such as Stripe,
                        JazzCash or Easypaisa is
                        integrated.
                    </Typography>
                </Box>

                {/* IMPORTANT */}

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Do not enter your card number
                    here until a secure payment
                    gateway has been integrated.
                </Typography>
            </Stack>
        </Paper>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

CardPaymentForm.propTypes = {
    disabled: PropTypes.bool,
};

// =====================================================
// EXPORT
// =====================================================

export default CardPaymentForm;