import {
    Box,
    Pagination,
    Typography,
} from "@mui/material";

const OrderPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
}) => {
    const start =
        totalItems === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const end = Math.min(
        currentPage * pageSize,
        totalItems
    );

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            mt={3}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Showing {start} - {end} of {totalItems} orders
            </Typography>

            <Pagination
                page={currentPage}
                count={Math.max(totalPages, 1)}
                color="primary"
                shape="rounded"
                onChange={(event, page) =>
                    onPageChange(page)
                }
            />
        </Box>
    );
};

export default OrderPagination;