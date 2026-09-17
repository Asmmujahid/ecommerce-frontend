import {
    Chip,
} from "@mui/material";

const ReturnStatusChip = ({ status = "pending" }) => {
    const normalizedStatus =
        String(status).toLowerCase();

    const statusConfig = {
        pending: {
            label: "Pending",
            color: "warning",
        },

        approved: {
            label: "Approved",
            color: "info",
        },

        rejected: {
            label: "Rejected",
            color: "error",
        },

        refunded: {
            label: "Refunded",
            color: "success",
        },
    };

    const config =
        statusConfig[normalizedStatus] ||
        {
            label: status || "Unknown",
            color: "default",
        };

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            sx={{
                fontWeight: 600,
                textTransform: "capitalize",
            }}
        />
    );
};

export default ReturnStatusChip;