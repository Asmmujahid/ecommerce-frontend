import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";

import TableRowsIcon from "@mui/icons-material/TableRows";
import GridViewIcon from "@mui/icons-material/GridView";

import ReturnRequestTable from "../../../components/admin/returnRequest/ReturnRequestTable";
import ReturnRequestCard from "../../../components/admin/returnRequest/ReturnRequestCard";
import ReturnRequestSearch from "../../../components/admin/returnRequest/ReturnRequestSearch";

import {
    getReturnRequests,
    deleteReturnRequest,
    clearReturnRequestError,
    clearReturnRequestMessage,
} from "../../../redux/admin/returnRequestSlice";

const ReturnRequests = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        returnRequests,
        loading,
        error,
        successMessage,
    } = useSelector(
        (state) => state.adminReturnRequest
    );

    const [viewMode, setViewMode] =
        useState("table");

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getReturnRequests());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(
                    clearReturnRequestMessage()
                );
            }, 3000);

            return () =>
                clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(
                clearReturnRequestError()
            );
            dispatch(
                clearReturnRequestMessage()
            );
        };
    }, [dispatch]);

    const filteredRequests = useMemo(() => {
        if (!search.trim())
            return returnRequests;

        const keyword =
            search.toLowerCase();

        return returnRequests.filter(
            (request) => {
                return (
                    String(
                        request.id
                    ).includes(keyword) ||
                    String(
                        request.user_id
                    ).includes(keyword) ||
                    String(
                        request.order_id
                    ).includes(keyword) ||
                    request.user?.name
                        ?.toLowerCase()
                        .includes(keyword) ||
                    request.orderItem?.product?.name
                        ?.toLowerCase()
                        .includes(keyword) ||
                    request.reason
                        ?.toLowerCase()
                        .includes(keyword) ||
                    request.status
                        ?.toLowerCase()
                        .includes(keyword) ||
                    String(
                        request.refund_amount
                    ).includes(keyword)
                );
            }
        );
    }, [returnRequests, search]);

    const handleView = (id) => {
        navigate(
            `/admin/return-requests/view/${id}`
        );
    };

    const handleEdit = (id) => {
        navigate(
            `/admin/return-requests/edit/${id}`
        );
    };

    const handleDelete = (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this return request?"
            )
        ) {
            return;
        }

        dispatch(deleteReturnRequest(id));
    };

    return (
        <Container maxWidth="xl">
            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    md: "center",
                }}
                spacing={2}
                mb={3}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Return Request Management
                </Typography>

                <ToggleButtonGroup
                    exclusive
                    value={viewMode}
                    onChange={(e, value) => {
                        if (value) {
                            setViewMode(value);
                        }
                    }}
                    size="small"
                >
                    <ToggleButton value="table">
                        <TableRowsIcon />
                    </ToggleButton>

                    <ToggleButton value="grid">
                        <GridViewIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <ReturnRequestSearch
                value={search}
                onSearch={setSearch}
            />

            <Card>
                <CardContent>
                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            py={6}
                        >
                            <CircularProgress />
                        </Box>
                    ) : viewMode ===
                      "table" ? (
                        <ReturnRequestTable
                            returnRequests={
                                filteredRequests
                            }
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={
                                handleDelete
                            }
                        />
                    ) : (
                        <Grid
                            container
                            spacing={3}
                        >
                            {filteredRequests.length >
                            0 ? (
                                filteredRequests.map(
                                    (
                                        request
                                    ) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            lg={3}
                                            key={
                                                request.id
                                            }
                                        >
                                            <ReturnRequestCard
                                                request={
                                                    request
                                                }
                                                onView={
                                                    handleView
                                                }
                                                onEdit={
                                                    handleEdit
                                                }
                                                onDelete={
                                                    handleDelete
                                                }
                                            />
                                        </Grid>
                                    )
                                )
                            ) : (
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Typography
                                        align="center"
                                        color="text.secondary"
                                    >
                                        No return
                                        requests
                                        found.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ReturnRequests;