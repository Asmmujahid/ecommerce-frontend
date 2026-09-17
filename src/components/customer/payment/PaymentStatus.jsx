import PropTypes from "prop-types";

import {
    Chip,
} from "@mui/material";

import {
    CheckCircle,
    Error,
    HourglassEmpty,
    Replay,
} from "@mui/icons-material";

const PaymentStatus = ({
    status,
}) => {
    const normalizedStatus =
        String(
            status || "pending"
        ).toLowerCase();

    const config = {
        pending: {
            label: "Pending",
            color: "warning",
            icon: (
                <HourglassEmpty
                    fontSize="small"
                />
            ),
        },

        paid: {
            label: "Paid",
            color: "success",
            icon: (
                <CheckCircle
                    fontSize="small"
                />
            ),
        },

        failed: {
            label: "Failed",
            color: "error",
            icon: (
                <Error
                    fontSize="small"
                />
            ),
        },

        refunded: {
            label: "Refunded",
            color: "info",
            icon: (
                <Replay
                    fontSize="small"
                />
            ),
        },
    };

    const current =
        config[
            normalizedStatus
        ] || config.pending;

    return (
        <Chip
            label={current.label}
            color={current.color}
            icon={current.icon}
            size="small"
            sx={{
                fontWeight: 600,
            }}
        />
    );
};

PaymentStatus.propTypes = {
    status: PropTypes.string,
};

export default PaymentStatus;