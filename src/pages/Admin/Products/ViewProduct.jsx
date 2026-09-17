import {
    useEffect,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import {
    getProduct,
} from "../../../redux/admin/productSlice";

const ViewProduct = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        product,
        loading,
        error,
    } = useSelector(
        (state) => state.adminProduct
    );

    useEffect(() => {
        dispatch(
            getProduct(id)
        );
    }, [
        dispatch,
        id,
    ]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={8}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <div className="p-6">

                <Alert severity="error">
                    {error}
                </Alert>

            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">

                <Alert severity="warning">
                    Product not found.
                </Alert>

            </div>
        );
    }

    const isAdminOwned =
        product.owner_type === "admin";

    const isVendorOwned =
        product.owner_type === "vendor";

    return (
        <div className="p-6">

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >

                {/* Header */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    flexWrap="wrap"
                    gap={2}
                >

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Product Details
                    </Typography>

                    <Box
                        display="flex"
                        gap={2}
                    >

                        <Button
                            component={Link}
                            to={`/admin/products/edit/${product.id}`}
                            variant="contained"
                            startIcon={
                                <EditIcon />
                            }
                        >
                            Edit
                        </Button>

                        <Button
                            component={Link}
                            to="/admin/products"
                            variant="outlined"
                            startIcon={
                                <ArrowBackIcon />
                            }
                        >
                            Back
                        </Button>

                    </Box>

                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid
                    container
                    spacing={4}
                >

                    {/* Thumbnail */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Thumbnail
                        </Typography>

                        {product.thumbnail ? (

                            <img
                                src={
                                    product.thumbnail
                                }
                                alt={
                                    product.name
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                "
                            />

                        ) : (

                            <Box
                                sx={{
                                    height: 250,
                                    border:
                                        "1px dashed #ccc",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    borderRadius: 2,
                                }}
                            >
                                No Thumbnail
                            </Box>

                        )}

                    </Grid>

                    {/* Product Details */}

                    <Grid
                        item
                        xs={12}
                        md={8}
                    >

                        <Grid
                            container
                            spacing={3}
                        >

                            <Grid
                                item
                                xs={12}
                            >

                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                >
                                    {product.name}
                                </Typography>

                            </Grid>

                            {/* Ownership */}

                            <Grid
                                item
                                xs={12}
                            >

                                <Typography
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Product Ownership
                                </Typography>

                                {isAdminOwned && (
                                    <Chip
                                        label="Admin Owned"
                                        color="primary"
                                    />
                                )}

                                {isVendorOwned && (
                                    <Chip
                                        label="Vendor Owned"
                                        color="success"
                                    />
                                )}

                            </Grid>

                            {/* Vendor Store */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Vendor Store
                                </Typography>

                                <Typography
                                    fontWeight="600"
                                >
                                    {
                                        product
                                            .vendor
                                            ?.name ||
                                        "-"
                                    }
                                </Typography>

                            </Grid>

                            {/* SKU */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    SKU
                                </Typography>

                                <Typography>
                                    {product.sku || "-"}
                                </Typography>

                            </Grid>

                            {/* Category */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Category
                                </Typography>

                                <Typography>
                                    {
                                        product
                                            .category
                                            ?.name ||
                                        "-"
                                    }
                                </Typography>

                            </Grid>

                            {/* Brand */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Brand
                                </Typography>

                                <Typography>
                                    {
                                        product
                                            .brand
                                            ?.name ||
                                        "-"
                                    }
                                </Typography>

                            </Grid>

                            {/* Price */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Price
                                </Typography>

                                <Typography>
                                    Rs.{" "}
                                    {product.price}
                                </Typography>

                            </Grid>

                            {/* Discount */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Discount Price
                                </Typography>

                                <Typography>
                                    {
                                        product.discount_price
                                            ? `Rs. ${product.discount_price}`
                                            : "-"
                                    }
                                </Typography>

                            </Grid>

                            {/* Stock */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Stock
                                </Typography>

                                <Typography>
                                    {
                                        product.stock
                                    }
                                </Typography>

                            </Grid>

                            {/* Status */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Status
                                </Typography>

                                <Chip
                                    label={
                                        product.status
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    color={
                                        product.status
                                            ? "success"
                                            : "default"
                                    }
                                />

                            </Grid>

                            {/* Featured */}

                            <Grid
                                item
                                xs={6}
                            >

                                <Typography
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Featured
                                </Typography>

                                <Chip
                                    label={
                                        product.featured
                                            ? "Yes"
                                            : "No"
                                    }
                                    color={
                                        product.featured
                                            ? "primary"
                                            : "default"
                                    }
                                />

                            </Grid>

                        </Grid>

                    </Grid>

                    {/* Description */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider
                            sx={{ my: 2 }}
                        />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Description
                        </Typography>

                        <Typography>
                            {
                                product.description ||
                                "No description available."
                            }
                        </Typography>

                    </Grid>

                    {/* Images */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider
                            sx={{ my: 2 }}
                        />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Product Images
                        </Typography>

                        <Box
                            display="flex"
                            gap={2}
                            flexWrap="wrap"
                        >

                            {product.images?.length > 0 ? (

                                product.images.map(
                                    (image) => (
                                        <img
                                            key={
                                                image.id
                                            }
                                            src={
                                                image.image
                                            }
                                            alt=""
                                            className="
                                                w-32
                                                h-32
                                                object-cover
                                                rounded-lg
                                                border
                                            "
                                        />
                                    )
                                )

                            ) : (

                                <Typography>
                                    No Images
                                </Typography>

                            )}

                        </Box>

                    </Grid>

                    {/* Variants */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider
                            sx={{ my: 2 }}
                        />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Product Variants
                        </Typography>

                        {product.variants?.length > 0 ? (

                            <div className="overflow-x-auto">

                                <table
                                    className="
                                        min-w-full
                                        border
                                    "
                                >

                                    <thead
                                        className="
                                            bg-gray-100
                                        "
                                    >

                                        <tr>

                                            <th className="border px-4 py-2">
                                                SKU
                                            </th>

                                            <th className="border px-4 py-2">
                                                Size
                                            </th>

                                            <th className="border px-4 py-2">
                                                Color
                                            </th>

                                            <th className="border px-4 py-2">
                                                Price
                                            </th>

                                            <th className="border px-4 py-2">
                                                Stock
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {product.variants.map(
                                            (variant) => (
                                                <tr
                                                    key={
                                                        variant.id
                                                    }
                                                >

                                                    <td className="border px-4 py-2">
                                                        {
                                                            variant.sku
                                                        }
                                                    </td>

                                                    <td className="border px-4 py-2">
                                                        {
                                                            variant.size ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="border px-4 py-2">
                                                        {
                                                            variant.color ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="border px-4 py-2">
                                                        {
                                                            variant.price ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="border px-4 py-2">
                                                        {
                                                            variant.stock
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <Typography>
                                No Variants
                            </Typography>

                        )}

                    </Grid>

                </Grid>

            </Paper>

        </div>
    );
};

export default ViewProduct;

