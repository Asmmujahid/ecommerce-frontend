import {
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    Button,
    Box,
} from "@mui/material";

import {
    Visibility,
    Cancel,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import ReturnStatusChip from "./ReturnStatusChip";

const ReturnCard = ({
    returnRequest,
    onCancel,
    cancelling = false,
}) => {
    const navigate = useNavigate();

    if (!returnRequest) {
        return null;
    }

    const {
        id,
        order_id,
        order_item_id,
        reason,
        status,
        refund_amount,
        admin_note,
        created_at,
    } = returnRequest;

    const isPending =
        String(status).toLowerCase() ===
        "pending";

    const formattedDate = created_at
        ? new Date(created_at).toLocaleDateString(
              "en-PK",
              {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              }
          )
        : "N/A";

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    {/* HEADER */}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Return #{id}
                        </Typography>

                        <ReturnStatusChip
                            status={status}
                        />
                    </Stack>

                    <Divider />

                    {/* ORDER */}

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Order ID
                        </Typography>

                        <Typography fontWeight={600}>
                            #{order_id}
                        </Typography>
                    </Box>

                    {/* ORDER ITEM */}

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Order Item ID
                        </Typography>

                        <Typography fontWeight={600}>
                            #{order_item_id}
                        </Typography>
                    </Box>

                    {/* REASON */}

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Reason
                        </Typography>

                        <Typography>
                            {reason || "No reason provided"}
                        </Typography>
                    </Box>

                    {/* REFUND */}

                    {refund_amount !== null &&
                        refund_amount !==
                            undefined && (
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Refund Amount
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                >
                                    Rs.{" "}
                                    {Number(
                                        refund_amount
                                    ).toLocaleString()}
                                </Typography>
                            </Box>
                        )}

                    {/* ADMIN NOTE */}

                    {admin_note && (
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Admin Note
                            </Typography>

                            <Typography>
                                {admin_note}
                            </Typography>
                        </Box>
                    )}

                    {/* DATE */}

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Submitted
                        </Typography>

                        <Typography>
                            {formattedDate}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* ACTIONS */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            fullWidth
                            onClick={() =>
                                navigate(
                                    `/customer/return-requests/${id}`
                                )
                            }
                        >
                            View Details
                        </Button>

                        {isPending && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                fullWidth
                                disabled={cancelling}
                                onClick={() =>
                                    onCancel(id)
                                }
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel"}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ReturnCard;