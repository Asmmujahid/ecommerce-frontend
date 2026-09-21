// src/pages/Shop/Shop.jsx

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

// =====================================================
// MATERIAL UI
// =====================================================

import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import Drawer from "@mui/material/Drawer";

// =====================================================
// ICONS
// =====================================================

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloseIcon from "@mui/icons-material/Close";

// =====================================================
// REDUX - PRODUCTS
// =====================================================

import {
    fetchProducts,
    selectProducts,
    selectProductLoading,
    selectProductError,
} from "../../redux/customer/productSlice";

// =====================================================
// REDUX - CATEGORIES
// =====================================================

import {
    getCategories,
    selectCategories,
    selectCategoryLoading,
    selectCategoryError,
} from "../../redux/customer/categorySlice";

// =====================================================
// REDUX - BRANDS
// =====================================================

import {
    fetchBrands,
    selectBrands,
    selectBrandLoading,
    selectBrandError,
} from "../../redux/customer/brandSlice";

// =====================================================
// COMPONENTS
// =====================================================

import ProductCard from "../../components/customer/products/ProductCard";

import ProductSkeleton from "../../components/ui/Skeleton/ProductSkeleton/ProductSkeleton";

import ErrorState from "../../components/Common/ErrorState/ErrorState";

import EmptyState from "../../components/Common/EmptyState/EmptyState";

// =====================================================
// CONSTANTS
// =====================================================

const STORAGE_URL =
    "http://127.0.0.1:8000/storage";

const PRODUCTS_PER_PAGE = 12;

// =====================================================
// COMPONENT
// =====================================================

const Shop = () => {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] =
        useSearchParams();

    // =================================================
    // REDUX STATE
    // =================================================

    const products = useSelector(
        selectProducts
    );

    const productLoading = useSelector(
        selectProductLoading
    );

    const productError = useSelector(
        selectProductError
    );

    const categories = useSelector(
        selectCategories
    );

    const categoryLoading = useSelector(
        selectCategoryLoading
    );

    const categoryError = useSelector(
        selectCategoryError
    );

    const brands = useSelector(
        selectBrands
    );

    const brandLoading = useSelector(
        selectBrandLoading
    );

    const brandError = useSelector(
        selectBrandError
    );

    // =================================================
    // URL PARAMETERS
    // =================================================

    const urlSearch =
        searchParams.get("search") || "";

    const urlCategory =
        searchParams.get("category") || "";

    const urlBrand =
        searchParams.get("brand") || "";

    const urlFeatured =
        searchParams.get("featured") === "1";

    const urlSort =
        searchParams.get("sort") || "latest";

    // =================================================
    // LOCAL STATE
    // =================================================

    const [search, setSearch] =
        useState(urlSearch);

    const [selectedCategory, setSelectedCategory] =
        useState(urlCategory);

    const [selectedBrand, setSelectedBrand] =
        useState(urlBrand);

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [inStockOnly, setInStockOnly] =
        useState(false);

    const [featuredOnly, setFeaturedOnly] =
        useState(urlFeatured);

    const [sortBy, setSortBy] =
        useState(urlSort);

    const [viewMode, setViewMode] =
        useState("grid");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [mobileFilterOpen, setMobileFilterOpen] =
        useState(false);

    // =================================================
    // FETCH DATA
    // =================================================

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(getCategories());
        dispatch(fetchBrands());
    }, [dispatch]);

    // =================================================
    // SYNC URL SEARCH
    // =================================================

    useEffect(() => {
        setSearch(urlSearch);
        setCurrentPage(1);
    }, [urlSearch]);

    // =================================================
    // SYNC URL CATEGORY
    // =================================================

    useEffect(() => {
        setSelectedCategory(urlCategory);
        setCurrentPage(1);
    }, [urlCategory]);

    // =================================================
    // SYNC URL BRAND
    // =================================================

    useEffect(() => {
        setSelectedBrand(urlBrand);
        setCurrentPage(1);
    }, [urlBrand]);

    // =================================================
    // SYNC URL FEATURED
    // =================================================

    useEffect(() => {
        setFeaturedOnly(urlFeatured);
        setCurrentPage(1);
    }, [urlFeatured]);

    // =================================================
    // SYNC URL SORT
    // =================================================

    useEffect(() => {
        setSortBy(urlSort);
        setCurrentPage(1);
    }, [urlSort]);

    // =================================================
    // SAFE ARRAYS
    // =================================================

    const safeProducts =
        Array.isArray(products)
            ? products
            : [];

    const safeCategories =
        Array.isArray(categories)
            ? categories
            : [];

    const safeBrands =
        Array.isArray(brands)
            ? brands
            : [];

    // =================================================
    // SEARCH KEYWORD
    // =================================================

    const searchKeyword =
        search.trim().toLowerCase();

    // =================================================
    // PRODUCT PRICE
    // =================================================

    const getProductPrice = (product) => {
        const discountPrice = Number(
            product?.discount_price ?? 0
        );

        const price = Number(
            product?.price ?? 0
        );

        if (
            discountPrice > 0 &&
            discountPrice < price
        ) {
            return discountPrice;
        }

        return price;
    };

    // =================================================
    // FILTER PRODUCTS
    // =================================================

    const filteredProducts = useMemo(() => {
        return safeProducts.filter(
            (product) => {
                // -------------------------------------
                // PRODUCT NAME
                // -------------------------------------

                const productName =
                    String(
                        product?.name || ""
                    ).toLowerCase();

                // -------------------------------------
                // SHORT DESCRIPTION
                // -------------------------------------

                const shortDescription =
                    String(
                        product?.short_description ||
                            ""
                    ).toLowerCase();

                // -------------------------------------
                // DESCRIPTION
                // -------------------------------------

                const description =
                    String(
                        product?.description || ""
                    ).toLowerCase();

                // -------------------------------------
                // CATEGORY NAME
                // -------------------------------------

                const categoryName =
                    String(
                        product?.category?.name ||
                            ""
                    ).toLowerCase();

                // -------------------------------------
                // BRAND NAME
                // -------------------------------------

                const brandName =
                    String(
                        product?.brand?.name || ""
                    ).toLowerCase();

                // -------------------------------------
                // SEARCH
                // -------------------------------------

                const matchesSearch =
                    !searchKeyword ||
                    productName.includes(
                        searchKeyword
                    ) ||
                    shortDescription.includes(
                        searchKeyword
                    ) ||
                    description.includes(
                        searchKeyword
                    ) ||
                    categoryName.includes(
                        searchKeyword
                    ) ||
                    brandName.includes(
                        searchKeyword
                    );

                // -------------------------------------
                // CATEGORY
                // -------------------------------------

                const matchesCategory =
                    !selectedCategory ||
                    Number(
                        product?.category?.id
                    ) ===
                        Number(
                            selectedCategory
                        ) ||
                    Number(
                        product?.category_id
                    ) ===
                        Number(
                            selectedCategory
                        );

                // -------------------------------------
                // BRAND
                // -------------------------------------

                const matchesBrand =
                    !selectedBrand ||
                    Number(
                        product?.brand?.id
                    ) ===
                        Number(
                            selectedBrand
                        ) ||
                    Number(
                        product?.brand_id
                    ) ===
                        Number(
                            selectedBrand
                        );

                // -------------------------------------
                // PRICE
                // -------------------------------------

                const currentPrice =
                    getProductPrice(product);

                const matchesMinPrice =
                    !minPrice ||
                    currentPrice >=
                        Number(minPrice);

                const matchesMaxPrice =
                    !maxPrice ||
                    currentPrice <=
                        Number(maxPrice);

                // -------------------------------------
                // STOCK
                // -------------------------------------

                const stock = Number(
                    product?.stock ??
                        product?.inventory
                            ?.stock ??
                        0
                );

                const matchesStock =
                    !inStockOnly ||
                    stock > 0;

                // -------------------------------------
                // FEATURED
                // -------------------------------------

                const isFeatured =
                    product?.featured === true ||
                    product?.featured === 1 ||
                    product?.featured === "1";

                const matchesFeatured =
                    !featuredOnly ||
                    isFeatured;

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesBrand &&
                    matchesMinPrice &&
                    matchesMaxPrice &&
                    matchesStock &&
                    matchesFeatured
                );
            }
        );
    }, [
        safeProducts,
        searchKeyword,
        selectedCategory,
        selectedBrand,
        minPrice,
        maxPrice,
        inStockOnly,
        featuredOnly,
    ]);

    // =================================================
    // SORT PRODUCTS
    // =================================================

    const sortedProducts = useMemo(() => {
        const result = [
            ...filteredProducts,
        ];

        result.sort((a, b) => {
            switch (sortBy) {
                case "latest":
                    return (
                        new Date(
                            b?.created_at || 0
                        ).getTime() -
                        new Date(
                            a?.created_at || 0
                        ).getTime()
                    );

                case "oldest":
                    return (
                        new Date(
                            a?.created_at || 0
                        ).getTime() -
                        new Date(
                            b?.created_at || 0
                        ).getTime()
                    );

                case "price-low":
                    return (
                        getProductPrice(a) -
                        getProductPrice(b)
                    );

                case "price-high":
                    return (
                        getProductPrice(b) -
                        getProductPrice(a)
                    );

                case "name-asc":
                    return String(
                        a?.name || ""
                    ).localeCompare(
                        String(
                            b?.name || ""
                        )
                    );

                case "name-desc":
                    return String(
                        b?.name || ""
                    ).localeCompare(
                        String(
                            a?.name || ""
                        )
                    );

                case "best-selling":
                    return (
                        Number(
                            b?.sales_count || 0
                        ) -
                        Number(
                            a?.sales_count || 0
                        )
                    );

                default:
                    return 0;
            }
        });

        return result;
    }, [
        filteredProducts,
        sortBy,
    ]);

    // =================================================
    // PAGINATION
    // =================================================

    const totalProducts =
        sortedProducts.length;

    const totalPages = Math.ceil(
        totalProducts /
            PRODUCTS_PER_PAGE
    );

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(
                  currentPage,
                  totalPages
              )
            : 1;

    const indexOfLastProduct =
        safeCurrentPage *
        PRODUCTS_PER_PAGE;

    const indexOfFirstProduct =
        indexOfLastProduct -
        PRODUCTS_PER_PAGE;

    const currentProducts =
        sortedProducts.slice(
            indexOfFirstProduct,
            indexOfLastProduct
        );

    // =================================================
    // RESET INVALID PAGE
    // =================================================

    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(
                totalPages
            );
        }

        if (
            totalPages === 0 &&
            currentPage !== 1
        ) {
            setCurrentPage(1);
        }
    }, [
        currentPage,
        totalPages,
    ]);

    // =================================================
    // PAGE NAVIGATION
    // =================================================

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =================================================
    // SEARCH CHANGE
    // =================================================

    const handleSearchChange = (
        event
    ) => {
        const value =
            event.target.value;

        setSearch(value);
        setCurrentPage(1);
    };

    // =================================================
    // SEARCH SUBMIT
    // =================================================

    const handleSearchSubmit = (
        event
    ) => {
        event.preventDefault();

        const params = {};

        if (search.trim()) {
            params.search =
                search.trim();
        }

        if (selectedCategory) {
            params.category =
                selectedCategory;
        }

        if (selectedBrand) {
            params.brand =
                selectedBrand;
        }

        if (featuredOnly) {
            params.featured = "1";
        }

        if (sortBy !== "latest") {
            params.sort = sortBy;
        }

        setSearchParams(params);

        setCurrentPage(1);
    };

    // =================================================
    // SORT CHANGE
    // =================================================

    const handleSortChange = (
        event
    ) => {
        const value =
            event.target.value;

        setSortBy(value);
        setCurrentPage(1);

        const params =
            new URLSearchParams(
                searchParams
            );

        if (value === "latest") {
            params.delete("sort");
        } else {
            params.set(
                "sort",
                value
            );
        }

        setSearchParams(params);
    };

    // =================================================
    // CATEGORY CHANGE
    // =================================================

    const handleCategoryChange = (
        categoryId
    ) => {
        setSelectedCategory(
            categoryId
        );

        setCurrentPage(1);

        const params =
            new URLSearchParams(
                searchParams
            );

        if (categoryId) {
            params.set(
                "category",
                String(categoryId)
            );
        } else {
            params.delete(
                "category"
            );
        }

        setSearchParams(params);
    };

    // =================================================
    // BRAND CHANGE
    // =================================================

    const handleBrandChange = (
        brandId
    ) => {
        setSelectedBrand(
            brandId
        );

        setCurrentPage(1);

        const params =
            new URLSearchParams(
                searchParams
            );

        if (brandId) {
            params.set(
                "brand",
                String(brandId)
            );
        } else {
            params.delete(
                "brand"
            );
        }

        setSearchParams(params);
    };

    // =================================================
    // CLEAR FILTERS
    // =================================================

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSelectedBrand("");
        setMinPrice("");
        setMaxPrice("");
        setInStockOnly(false);
        setFeaturedOnly(false);
        setSortBy("latest");
        setCurrentPage(1);

        setSearchParams({});
    };

    // =================================================
    // PRODUCT IMAGE
    // =================================================

    const getProductImage = (
        product
    ) => {
        let imagePath = null;

        // ---------------------------------------------
        // PRODUCT IMAGES
        // ---------------------------------------------

        if (
            Array.isArray(
                product?.images
            ) &&
            product.images.length > 0
        ) {
            const firstImage =
                product.images[0];

            if (
                typeof firstImage ===
                "string"
            ) {
                imagePath =
                    firstImage;
            } else if (
                firstImage?.image
            ) {
                imagePath =
                    firstImage.image;
            } else if (
                firstImage?.url
            ) {
                imagePath =
                    firstImage.url;
            } else if (
                firstImage?.path
            ) {
                imagePath =
                    firstImage.path;
            }
        }

        // ---------------------------------------------
        // THUMBNAIL
        // ---------------------------------------------

        if (
            !imagePath &&
            product?.thumbnail
        ) {
            imagePath =
                product.thumbnail;
        }

        // ---------------------------------------------
        // SINGLE IMAGE
        // ---------------------------------------------

        if (
            !imagePath &&
            product?.image
        ) {
            imagePath =
                product.image;
        }

        // ---------------------------------------------
        // FALLBACK
        // ---------------------------------------------

        if (!imagePath) {
            return "/images/no-image.png";
        }

        const cleanPath =
            String(imagePath)
                .trim()
                .replace(/^\/+/, "");

        // ---------------------------------------------
        // FULL URL
        // ---------------------------------------------

        if (
            cleanPath.startsWith(
                "http://"
            ) ||
            cleanPath.startsWith(
                "https://"
            )
        ) {
            return cleanPath;
        }

        // ---------------------------------------------
        // STORAGE PATH
        // ---------------------------------------------

        if (
            cleanPath.startsWith(
                "storage/"
            )
        ) {
            return `http://127.0.0.1:8000/${cleanPath}`;
        }

        // ---------------------------------------------
        // NORMAL STORAGE PATH
        // ---------------------------------------------

        return `${STORAGE_URL}/${cleanPath}`;
    };

    // =================================================
    // DISCOUNT
    // =================================================

    const hasDiscount = (
        product
    ) => {
        const price = Number(
            product?.price || 0
        );

        const discountPrice =
            Number(
                product?.discount_price ||
                    0
            );

        return (
            price > 0 &&
            discountPrice > 0 &&
            discountPrice < price
        );
    };

    // =================================================
    // DISCOUNT PERCENTAGE
    // =================================================

    const getDiscountPercentage = (
        product
    ) => {
        if (
            !hasDiscount(product)
        ) {
            return 0;
        }

        const price = Number(
            product?.price
        );

        const discountPrice =
            Number(
                product?.discount_price
            );

        return Math.round(
            ((price -
                discountPrice) /
                price) *
                100
        );
    };

    // =================================================
    // CURRENCY
    // =================================================

    const formatCurrency = (
        price
    ) => {
        return `$${Number(
            price || 0
        ).toFixed(2)}`;
    };

    // =================================================
    // STOCK
    // =================================================

    const getStock = (
        product
    ) => {
        return Number(
            product?.stock ??
                product?.inventory
                    ?.stock ??
                0
        );
    };

    const getStockStatus = (
        product
    ) => {
        const stock =
            getStock(product);

        if (stock <= 0) {
            return "Out of Stock";
        }

        if (stock <= 5) {
            return "Low Stock";
        }

        return "In Stock";
    };

    // =================================================
    // ACTIVE FILTERS
    // =================================================

    const hasActiveFilters =
        Boolean(search) ||
        Boolean(selectedCategory) ||
        Boolean(selectedBrand) ||
        Boolean(minPrice) ||
        Boolean(maxPrice) ||
        inStockOnly ||
        featuredOnly;

    // =================================================
    // FILTER SIDEBAR
    // =================================================

    const renderFilters = () => (
        <>
            {/* =========================================
                CATEGORIES
            ========================================= */}

            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">
                    Categories
                </h3>

                {categoryLoading ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading categories...
                    </Typography>
                ) : categoryError ? (
                    <Typography
                        variant="body2"
                        color="error"
                    >
                        {categoryError}
                    </Typography>
                ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        selectedCategory ===
                                        ""
                                    }
                                    onChange={() =>
                                        handleCategoryChange(
                                            ""
                                        )
                                    }
                                />
                            }
                            label="All Categories"
                        />

                        {safeCategories.map(
                            (
                                category
                            ) => (
                                <FormControlLabel
                                    key={
                                        category.id
                                    }
                                    control={
                                        <Checkbox
                                            checked={
                                                Number(
                                                    selectedCategory
                                                ) ===
                                                Number(
                                                    category.id
                                                )
                                            }
                                            onChange={() =>
                                                handleCategoryChange(
                                                    category.id
                                                )
                                            }
                                        />
                                    }
                                    label={
                                        category.name
                                    }
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* =========================================
                BRANDS
            ========================================= */}

            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">
                    Brands
                </h3>

                {brandLoading ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading brands...
                    </Typography>
                ) : brandError ? (
                    <Typography
                        variant="body2"
                        color="error"
                    >
                        {brandError}
                    </Typography>
                ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        selectedBrand ===
                                        ""
                                    }
                                    onChange={() =>
                                        handleBrandChange(
                                            ""
                                        )
                                    }
                                />
                            }
                            label="All Brands"
                        />

                        {safeBrands.map(
                            (brand) => (
                                <FormControlLabel
                                    key={
                                        brand.id
                                    }
                                    control={
                                        <Checkbox
                                            checked={
                                                Number(
                                                    selectedBrand
                                                ) ===
                                                Number(
                                                    brand.id
                                                )
                                            }
                                            onChange={() =>
                                                handleBrandChange(
                                                    brand.id
                                                )
                                            }
                                        />
                                    }
                                    label={
                                        brand.name
                                    }
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* =========================================
                PRICE
            ========================================= */}

            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">
                    Price Range
                </h3>

                <div className="space-y-4">
                    <TextField
                        fullWidth
                        type="number"
                        label="Minimum Price"
                        value={minPrice}
                        inputProps={{
                            min: 0,
                        }}
                        onChange={(
                            event
                        ) => {
                            setMinPrice(
                                event.target.value
                            );

                            setCurrentPage(
                                1
                            );
                        }}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        label="Maximum Price"
                        value={maxPrice}
                        inputProps={{
                            min: 0,
                        }}
                        onChange={(
                            event
                        ) => {
                            setMaxPrice(
                                event.target.value
                            );

                            setCurrentPage(
                                1
                            );
                        }}
                    />
                </div>
            </div>

            {/* =========================================
                STOCK
            ========================================= */}

            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">
                    Stock Status
                </h3>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={
                                inStockOnly
                            }
                            onChange={(
                                event
                            ) => {
                                setInStockOnly(
                                    event
                                        .target
                                        .checked
                                );

                                setCurrentPage(
                                    1
                                );
                            }}
                        />
                    }
                    label="In Stock Only"
                />
            </div>

            {/* =========================================
                FEATURED
            ========================================= */}

            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">
                    Featured
                </h3>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={
                                featuredOnly
                            }
                            onChange={(
                                event
                            ) => {
                                const checked =
                                    event
                                        .target
                                        .checked;

                                setFeaturedOnly(
                                    checked
                                );

                                setCurrentPage(
                                    1
                                );

                                const params =
                                    new URLSearchParams(
                                        searchParams
                                    );

                                if (
                                    checked
                                ) {
                                    params.set(
                                        "featured",
                                        "1"
                                    );
                                } else {
                                    params.delete(
                                        "featured"
                                    );
                                }

                                setSearchParams(
                                    params
                                );
                            }}
                        />
                    }
                    label="Featured Products"
                />
            </div>
        </>
    );

    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="min-h-screen bg-gray-100">

            {/* =================================================
                SHOP HERO
            ================================================= */}

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white">
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
                    <div className="max-w-3xl">
                        <p className="text-blue-100 text-sm font-medium mb-3">
                            Home / Shop
                        </p>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Discover Your Next Favorite
                        </h1>

                        <p className="mt-4 text-blue-100 text-base md:text-lg leading-7 max-w-2xl">
                            Explore our collection of
                            quality products. Search,
                            filter and sort to quickly
                            find exactly what you are
                            looking for.
                        </p>
                    </div>
                </div>
            </section>

            {/* =================================================
                SHOP TOOLBAR
            ================================================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-6">

                    <form
                        onSubmit={
                            handleSearchSubmit
                        }
                    >
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

                            {/* SEARCH */}

                            <div className="flex-1">
                                <TextField
                                    fullWidth
                                    value={search}
                                    placeholder="Search products, categories or brands..."
                                    onChange={
                                        handleSearchChange
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <SearchIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />
                            </div>

                            {/* SEARCH BUTTON */}

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    <SearchIcon />
                                }
                                sx={{
                                    minHeight: 56,
                                    px: 4,
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                }}
                            >
                                Search
                            </Button>

                            {/* SORT */}

                            <div className="w-full sm:w-64">
                                <FormControl fullWidth>
                                    <InputLabel>
                                        Sort By
                                    </InputLabel>

                                    <Select
                                        label="Sort By"
                                        value={
                                            sortBy
                                        }
                                        onChange={
                                            handleSortChange
                                        }
                                    >
                                        <MenuItem value="latest">
                                            Latest
                                        </MenuItem>

                                        <MenuItem value="oldest">
                                            Oldest
                                        </MenuItem>

                                        <MenuItem value="best-selling">
                                            Best Selling
                                        </MenuItem>

                                        <MenuItem value="price-low">
                                            Price: Low to High
                                        </MenuItem>

                                        <MenuItem value="price-high">
                                            Price: High to Low
                                        </MenuItem>

                                        <MenuItem value="name-asc">
                                            Name: A - Z
                                        </MenuItem>

                                        <MenuItem value="name-desc">
                                            Name: Z - A
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* VIEW MODE */}

                            <div className="flex items-center justify-between sm:justify-start gap-1">

                                <IconButton
                                    color={
                                        viewMode ===
                                        "grid"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() =>
                                        setViewMode(
                                            "grid"
                                        )
                                    }
                                    aria-label="Grid view"
                                >
                                    <GridViewIcon />
                                </IconButton>

                                <IconButton
                                    color={
                                        viewMode ===
                                        "list"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() =>
                                        setViewMode(
                                            "list"
                                        )
                                    }
                                    aria-label="List view"
                                >
                                    <ViewListIcon />
                                </IconButton>

                                <IconButton
                                    className="lg:hidden"
                                    color="primary"
                                    onClick={() =>
                                        setMobileFilterOpen(
                                            true
                                        )
                                    }
                                    aria-label="Open filters"
                                >
                                    <FilterListIcon />
                                </IconButton>

                            </div>
                        </div>
                    </form>

                    {/* PRODUCT COUNT */}

                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-5 gap-4">

                        <Typography
                            variant="body1"
                            className="font-medium"
                        >
                            Showing{" "}
                            <span className="font-bold">
                                {
                                    currentProducts.length
                                }
                            </span>{" "}
                            of{" "}
                            <span className="font-bold">
                                {
                                    totalProducts
                                }
                            </span>{" "}
                            products
                        </Typography>

                        {hasActiveFilters && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={
                                    clearFilters
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 600,
                                }}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* =================================================
                SHOP CONTENT
            ================================================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* =================================================
                        DESKTOP FILTER SIDEBAR
                    ================================================= */}

                    <aside className="hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Filters
                                </h2>

                                <Button
                                    size="small"
                                    color="error"
                                    onClick={
                                        clearFilters
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 600,
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>

                            {renderFilters()}

                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={
                                    clearFilters
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 600,
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    </aside>

                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <div className="lg:col-span-3">

                        {/* LOADING */}

                        {productLoading ? (
                            <div
                                className={
                                    viewMode ===
                                    "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                        : "space-y-6"
                                }
                            >
                                {Array.from({
                                    length: 9,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <ProductSkeleton
                                            key={
                                                index
                                            }
                                        />
                                    )
                                )}
                            </div>
                        ) : productError ? (
                            <ErrorState
                                message={
                                    productError
                                }
                            />
                        ) : currentProducts.length ===
                          0 ? (
                            <EmptyState
                                title="No Products Found"
                                subtitle="Try changing your search or filters."
                            />
                        ) : (
                            <>
                                {/* =================================
                                    GRID VIEW
                                ================================= */}

                                {viewMode ===
                                    "grid" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {currentProducts.map(
                                            (
                                                product
                                            ) => (
                                                <ProductCard
                                                    key={
                                                        product.id
                                                    }
                                                    product={
                                                        product
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}

                                {/* =================================
                                    LIST VIEW
                                ================================= */}

                                {viewMode ===
                                    "list" && (
                                    <div className="space-y-6">
                                        {currentProducts.map(
                                            (
                                                product
                                            ) => {
                                                const stock =
                                                    getStock(
                                                        product
                                                    );

                                                const discounted =
                                                    hasDiscount(
                                                        product
                                                    );

                                                const isFeatured =
                                                    product?.featured ===
                                                        true ||
                                                    product?.featured ===
                                                        1 ||
                                                    product?.featured ===
                                                        "1";

                                                return (
                                                    <div
                                                        key={
                                                            product.id
                                                        }
                                                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                                    >
                                                        <div className="flex flex-col md:flex-row">

                                                            {/* IMAGE */}

                                                            <Link
                                                                to={`/product/${product.id}`}
                                                                className="md:w-64 flex-shrink-0 bg-gray-50"
                                                            >
                                                                <img
                                                                    src={getProductImage(
                                                                        product
                                                                    )}
                                                                    alt={
                                                                        product?.name ||
                                                                        "Product"
                                                                    }
                                                                    className="w-full h-64 md:h-full min-h-64 object-cover"
                                                                    onError={(
                                                                        event
                                                                    ) => {
                                                                        event.currentTarget.src =
                                                                            "/images/no-image.png";
                                                                    }}
                                                                />
                                                            </Link>

                                                            {/* DETAILS */}

                                                            <div className="flex-1 p-6">

                                                                <div className="flex justify-between items-start gap-4">

                                                                    <div>
                                                                        <Typography
                                                                            variant="h6"
                                                                            fontWeight="bold"
                                                                        >
                                                                            {
                                                                                product?.name
                                                                            }
                                                                        </Typography>

                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            sx={{
                                                                                mt: 1,
                                                                            }}
                                                                        >
                                                                            {
                                                                                product
                                                                                    ?.category
                                                                                    ?.name
                                                                            }

                                                                            {product
                                                                                ?.brand
                                                                                ?.name &&
                                                                                ` • ${product.brand.name}`}
                                                                        </Typography>
                                                                    </div>

                                                                    {isFeatured && (
                                                                        <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* DESCRIPTION */}

                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        mt: 2,
                                                                        lineHeight: 1.7,
                                                                    }}
                                                                >
                                                                    {product?.short_description ||
                                                                        (product?.description
                                                                            ? `${String(
                                                                                  product.description
                                                                              ).substring(
                                                                                  0,
                                                                                  180
                                                                              )}...`
                                                                            : "No description available.")}
                                                                </Typography>

                                                                {/* PRICE */}

                                                                <div className="flex flex-wrap items-center gap-3 mt-4">

                                                                    {discounted ? (
                                                                        <>
                                                                            <Typography
                                                                                variant="h6"
                                                                                color="primary"
                                                                                fontWeight="bold"
                                                                            >
                                                                                {formatCurrency(
                                                                                    product?.discount_price
                                                                                )}
                                                                            </Typography>

                                                                            <Typography
                                                                                color="text.secondary"
                                                                                sx={{
                                                                                    textDecoration:
                                                                                        "line-through",
                                                                                }}
                                                                            >
                                                                                {formatCurrency(
                                                                                    product?.price
                                                                                )}
                                                                            </Typography>

                                                                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                                                                -
                                                                                {
                                                                                    getDiscountPercentage(
                                                                                        product
                                                                                    )
                                                                                }
                                                                                %
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <Typography
                                                                            variant="h6"
                                                                            color="primary"
                                                                            fontWeight="bold"
                                                                        >
                                                                            {formatCurrency(
                                                                                product?.price
                                                                            )}
                                                                        </Typography>
                                                                    )}
                                                                </div>

                                                                {/* STOCK */}

                                                                <Typography
                                                                    sx={{
                                                                        mt: 2,
                                                                        fontWeight: 600,
                                                                    }}
                                                                    color={
                                                                        stock >
                                                                        0
                                                                            ? "success.main"
                                                                            : "error.main"
                                                                    }
                                                                >
                                                                    {getStockStatus(
                                                                        product
                                                                    )}
                                                                </Typography>

                                                                {/* BUTTON */}

                                                                <div className="mt-5">
                                                                   <Button
    component={Link}
    to={`/products/${product.id}`}
    variant="contained"
    sx={{
        textTransform: "none",
    }}
>
    View Details
</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        {!productLoading &&
                            !productError &&
                            totalPages > 1 && (
                                <div className="flex justify-center mt-12">
                                    <Pagination
                                        count={
                                            totalPages
                                        }
                                        page={
                                            safeCurrentPage
                                        }
                                        color="primary"
                                        shape="rounded"
                                        onChange={(
                                            _event,
                                            page
                                        ) =>
                                            goToPage(
                                                page
                                            )
                                        }
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </section>

            {/* =================================================
                MOBILE FILTER DRAWER
            ================================================= */}

            <Drawer
                anchor="left"
                open={
                    mobileFilterOpen
                }
                onClose={() =>
                    setMobileFilterOpen(
                        false
                    )
                }
            >
                <div className="w-80 max-w-[85vw] p-6">

                    <div className="flex justify-between items-center mb-6">
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Filters
                        </Typography>

                        <IconButton
                            onClick={() =>
                                setMobileFilterOpen(
                                    false
                                )
                            }
                            aria-label="Close filters"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {renderFilters()}

                    <div className="mt-8 space-y-3">

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() =>
                                setMobileFilterOpen(
                                    false
                                )
                            }
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            Apply Filters
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => {
                                clearFilters();

                                setMobileFilterOpen(
                                    false
                                );
                            }}
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

// =====================================================
// EXPORT
// =====================================================

export default Shop;