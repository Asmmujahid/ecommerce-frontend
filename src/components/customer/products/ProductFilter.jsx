
import { useEffect, useState } from "react";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Divider,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";

const ProductFilter = ({
    categories = [],
    brands = [],
    filters = {},
    onFilter,
    onClear,
    loading = false,
}) => {
    /*
    |--------------------------------------------------------------------------
    | Local Filter State
    |--------------------------------------------------------------------------
    */

    const [categoryId, setCategoryId] = useState(
        filters.category_id ?? ""
    );

    const [brandId, setBrandId] = useState(
        filters.brand_id ?? ""
    );

    const [featured, setFeatured] = useState(
        filters.featured ?? ""
    );

    /*
    |--------------------------------------------------------------------------
    | Keep Local State In Sync
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setCategoryId(filters.category_id ?? "");
        setBrandId(filters.brand_id ?? "");
        setFeatured(filters.featured ?? "");
    }, [
        filters.category_id,
        filters.brand_id,
        filters.featured,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Apply Filters
    |--------------------------------------------------------------------------
    */

    const handleApply = () => {
        const appliedFilters = {};

        if (categoryId !== "") {
            appliedFilters.category_id = categoryId;
        }

        if (brandId !== "") {
            appliedFilters.brand_id = brandId;
        }

        if (featured !== "") {
            appliedFilters.featured = featured;
        }

        if (onFilter) {
            onFilter(appliedFilters);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const handleClear = () => {
        setCategoryId("");
        setBrandId("");
        setFeatured("");

        if (onClear) {
            onClear();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Check Active Filters
    |--------------------------------------------------------------------------
    */

    const hasFilters =
        categoryId !== "" ||
        brandId !== "" ||
        featured !== "";

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 2,
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <FilterAltIcon color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Filter Products
                    </Typography>
                </Box>

                {hasFilters && (
                    <Button
                        size="small"
                        color="error"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                        }}
                    >
                        Clear
                    </Button>
                )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Filters */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {/* Category */}

                <FormControl
                    fullWidth
                    size="small"
                    disabled={loading}
                >
                    <InputLabel id="product-category-label">
                        Category
                    </InputLabel>

                    <Select
                        labelId="product-category-label"
                        value={categoryId}
                        label="Category"
                        onChange={(event) =>
                            setCategoryId(event.target.value)
                        }
                    >
                        <MenuItem value="">
                            All Categories
                        </MenuItem>

                        {Array.isArray(categories) &&
                            categories.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Brand */}

                <FormControl
                    fullWidth
                    size="small"
                    disabled={loading}
                >
                    <InputLabel id="product-brand-label">
                        Brand
                    </InputLabel>

                    <Select
                        labelId="product-brand-label"
                        value={brandId}
                        label="Brand"
                        onChange={(event) =>
                            setBrandId(event.target.value)
                        }
                    >
                        <MenuItem value="">
                            All Brands
                        </MenuItem>

                        {Array.isArray(brands) &&
                            brands.map((brand) => (
                                <MenuItem
                                    key={brand.id}
                                    value={brand.id}
                                >
                                    {brand.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Featured */}

                <FormControl
                    fullWidth
                    size="small"
                    disabled={loading}
                >
                    <InputLabel id="product-featured-label">
                        Featured
                    </InputLabel>

                    <Select
                        labelId="product-featured-label"
                        value={featured}
                        label="Featured"
                        onChange={(event) =>
                            setFeatured(event.target.value)
                        }
                    >
                        <MenuItem value="">
                            All Products
                        </MenuItem>

                        <MenuItem value={1}>
                            Featured Products
                        </MenuItem>

                        <MenuItem value={0}>
                            Non-Featured Products
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Apply Button */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<FilterAltIcon />}
                    onClick={handleApply}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        minWidth: 140,
                    }}
                >
                    {loading
                        ? "Loading..."
                        : "Apply Filters"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductFilter;

