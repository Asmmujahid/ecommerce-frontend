import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";

import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getProducts,
    deleteProduct,
} from "../../../redux/seller/sellerProductSlice";

import ProductCard from "./ProductCard";
import ProductTable from "./ProductTable";

const ProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =========================================================
    // REDUX STATE
    // =========================================================

    const sellerProductState = useSelector(
        (state) =>
            state?.sellerProducts || {
                products: [],
                loading: false,
                error: null,
                pagination: {},
            }
    );

    const {
        products: reduxProducts,
        loading = false,
        error = null,
        pagination = {},
    } = sellerProductState;

    const products = Array.isArray(reduxProducts)
        ? reduxProducts
        : [];

    // =========================================================
    // LOCAL STATE
    // =========================================================

    const [viewMode, setViewMode] = useState("grid");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [sort, setSort] = useState("created_at");
    const [direction, setDirection] = useState("desc");
    const [page, setPage] = useState(1);

    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = useMemo(() => {
        const categoryMap = new Map();

        products.forEach((product) => {
            if (
                product?.category &&
                product.category?.id
            ) {
                categoryMap.set(
                    product.category.id,
                    product.category
                );
            }
        });

        return Array.from(categoryMap.values());
    }, [products]);

    // =========================================================
    // LOAD PRODUCTS
    // =========================================================

    const loadProducts = useCallback(() => {
        const filters = {
            search: search.trim() || undefined,
            category_id: category || undefined,
            stock: stock || undefined,
            sort: sort || undefined,
            direction: direction || undefined,
            page,
            per_page: 10,
        };

        dispatch(getProducts(filters));
    }, [
        dispatch,
        search,
        category,
        stock,
        sort,
        direction,
        page,
    ]);

    // =========================================================
    // LOAD PRODUCTS WHEN FILTERS CHANGE
    // =========================================================

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    // =========================================================
    // CATEGORY
    // =========================================================

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setPage(1);
    };

    // =========================================================
    // STOCK
    // =========================================================

    const handleStockChange = (event) => {
        setStock(event.target.value);
        setPage(1);
    };

    // =========================================================
    // SORT
    // =========================================================

    const handleSortChange = (event) => {
        setSort(event.target.value);
        setPage(1);
    };

    // =========================================================
    // DIRECTION
    // =========================================================

    const handleDirectionChange = (event) => {
        setDirection(event.target.value);
        setPage(1);
    };

    // =========================================================
    // PAGE
    // =========================================================

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
    };

    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = () => {
        navigate("/seller/products/create");
    };

    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (product) => {
        const productId = product?.id;

        if (!productId) {
            console.error(
                "Cannot view product: Product ID is missing.",
                product
            );
            return;
        }

        navigate(`/seller/products/${productId}`);
    };

    // =========================================================
    // OWNERSHIP
    // =========================================================

    const isVendorOwned = (product) => {
        return (
            String(
                product?.owner_type || "vendor"
            ).toLowerCase() === "vendor"
        );
    };

    const isAdminOwned = (product) => {
        return (
            String(
                product?.owner_type || "vendor"
            ).toLowerCase() === "admin"
        );
    };

    // =========================================================
    // EDIT PRODUCT
    // =========================================================

    const handleEdit = (product) => {
        const productId = product?.id;

        console.log(
            "ProductList - product:",
            product
        );

        console.log(
            "ProductList - productId:",
            productId
        );

        if (!productId) {
            console.error(
                "Cannot edit product: Product ID is missing.",
                product
            );
            return;
        }

        // Seller can edit only vendor-owned products.

        if (!isVendorOwned(product)) {
            console.warn(
                "Admin-owned product cannot be edited by seller.",
                product
            );
            return;
        }

        /*
        IMPORTANT

        This route matches:

        /seller/products/:id/edit
        */

        navigate(
            `/seller/products/${productId}/edit`
        );
    };

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const handleDelete = async (product) => {
        const productId = product?.id;

        if (!productId) {
            console.error(
                "Cannot delete product: Product ID is missing.",
                product
            );
            return;
        }

        if (!isVendorOwned(product)) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        const result = await dispatch(
            deleteProduct(productId)
        );

        if (
            deleteProduct.fulfilled.match(result)
        ) {
            loadProducts();
        }
    };

    // =========================================================
    // RETRY
    // =========================================================

    const handleRetry = () => {
        loadProducts();
    };

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        pagination?.lastPage ??
        pagination?.last_page ??
        pagination?.total_pages ??
        1;

    // =========================================================
    // OWNERSHIP COUNTS
    // =========================================================

    const adminOwnedCount = products.filter(
        (product) => isAdminOwned(product)
    ).length;

    const vendorOwnedCount = products.filter(
        (product) => isVendorOwned(product)
    ).length;

    // =========================================================
    // LOADING
    // =========================================================

    if (
        loading &&
        products.length === 0
    ) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box sx={{ p: 3 }}>
            {/* HEADER */}

            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    md: "center",
                }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        My Store Products
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage products available in
                        your vendor store.
                    </Typography>
                </Box>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1.5}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{
                            minWidth: 160,
                        }}
                    >
                        Create Product
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRetry}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {/* OWNERSHIP INFORMATION */}

            <Alert
                severity="info"
                sx={{ mb: 3 }}
            >
                <strong>
                    Vendor-owned:
                </strong>{" "}
                {vendorOwnedCount}

                {" | "}

                <strong>
                    Admin-owned:
                </strong>{" "}
                {adminOwnedCount}

                <Box
                    component="span"
                    sx={{
                        display: "block",
                        mt: 0.5,
                    }}
                >
                    Admin-owned products assigned to
                    your store are visible here so
                    you can sell them. However, they
                    cannot be edited or deleted by you.
                </Box>
            </Alert>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleRetry}
                        >
                            Retry
                        </Button>
                    }
                >
                    {typeof error === "string"
                        ? error
                        : "Failed to load products."}
                </Alert>
            )}

            {/* FILTERS */}

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                }}
            >
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                >
                    <Grid
                        item
                        xs={12}
                        md={3}
                    >
                        <TextField
                            fullWidth
                            label="Search Product"
                            value={search}
                            onChange={
                                handleSearchChange
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={2}
                    >
                        <FormControl fullWidth>
                            <InputLabel>
                                Category
                            </InputLabel>

                            <Select
                                value={category}
                                label="Category"
                                onChange={
                                    handleCategoryChange
                                }
                            >
                                <MenuItem value="">
                                    All Categories
                                </MenuItem>

                                {categories.map(
                                    (item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={2}
                    >
                        <FormControl fullWidth>
                            <InputLabel>
                                Stock
                            </InputLabel>

                            <Select
                                value={stock}
                                label="Stock"
                                onChange={
                                    handleStockChange
                                }
                            >
                                <MenuItem value="">
                                    All
                                </MenuItem>

                                <MenuItem value="in_stock">
                                    In Stock
                                </MenuItem>

                                <MenuItem value="out_of_stock">
                                    Out of Stock
                                </MenuItem>

                                <MenuItem value="low_stock">
                                    Low Stock
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={2}
                    >
                        <FormControl fullWidth>
                            <InputLabel>
                                Sort By
                            </InputLabel>

                            <Select
                                value={sort}
                                label="Sort By"
                                onChange={
                                    handleSortChange
                                }
                            >
                                <MenuItem value="created_at">
                                    Created Date
                                </MenuItem>

                                <MenuItem value="name">
                                    Name
                                </MenuItem>

                                <MenuItem value="price">
                                    Price
                                </MenuItem>

                                <MenuItem value="stock">
                                    Stock
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={1.5}
                    >
                        <FormControl fullWidth>
                            <InputLabel>
                                Order
                            </InputLabel>

                            <Select
                                value={direction}
                                label="Order"
                                onChange={
                                    handleDirectionChange
                                }
                            >
                                <MenuItem value="desc">
                                    Desc
                                </MenuItem>

                                <MenuItem value="asc">
                                    Asc
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={1.5}
                    >
                        <ToggleButtonGroup
                            exclusive
                            value={viewMode}
                            onChange={(
                                _event,
                                value
                            ) => {
                                if (value) {
                                    setViewMode(value);
                                }
                            }}
                            fullWidth
                        >
                            <ToggleButton value="grid">
                                <GridViewIcon />
                            </ToggleButton>

                            <ToggleButton value="table">
                                <TableRowsIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Paper>

            {/* PRODUCTS */}

            {viewMode === "grid" ? (
                <Grid
                    container
                    spacing={3}
                >
                    {products.map(
                        (product) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                key={product.id}
                            >
                                <ProductCard
                                    product={product}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={
                                        handleDelete
                                    }
                                />
                            </Grid>
                        )
                    )}
                </Grid>
            ) : (
                <ProductTable
                    products={products}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* EMPTY */}

            {!loading &&
                products.length === 0 &&
                !error && (
                    <Paper
                        sx={{
                            p: 5,
                            mt: 3,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            No products found
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            There are currently no
                            products assigned to your
                            vendor store.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                        >
                            Create Product
                        </Button>
                    </Paper>
                )}

            {/* PAGINATION */}

            {totalPages > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                    }}
                >
                    <Pagination
                        count={Number(totalPages)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* LOADING */}

            {loading &&
                products.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3,
                        }}
                    >
                        <CircularProgress size={28} />
                    </Box>
                )}
        </Box>
    );
};

export default ProductList;