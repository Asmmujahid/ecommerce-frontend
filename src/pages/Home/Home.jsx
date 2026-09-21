// src/pages/Customer/Home/Home.jsx

import {
    useEffect,
    useMemo,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Button,
} from "@mui/material";

import {
    ArrowForward,
    LocalShipping,
    Security,
    Star,
    SupportAgent,
    ShoppingBag,
    AutoAwesome,
} from "@mui/icons-material";

// =====================================================
// REDUX - BANNERS
// =====================================================

import {
    fetchBanners,
    selectBanners,
    selectBannerLoading,
    selectBannerError,
} from "../../redux/customer/bannerSlice";

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
// REDUX - PRODUCTS
// =====================================================

import {
    fetchProducts,
    selectProducts,
    selectProductLoading,
    selectProductError,
} from "../../redux/customer/productSlice";

// =====================================================
// COMPONENTS
// =====================================================

import BannerList from "../../components/customer/banners/BannerList";

import CategoryCard from "../../components/customer/categories/CategoryCard";

import BrandCard from "../../components/customer/brands/BrandCard";

import ProductCard from "../../components/customer/products/ProductCard";

// =====================================================
// SKELETONS
// =====================================================

import BannerSkeleton from "../../components/ui/Skeleton/BannerSkeleton/BannerSkeleton";

import CategorySkeleton from "../../components/ui/Skeleton/CategorySkeleton/CategorySkeleton";

import BrandSkeleton from "../../components/ui/Skeleton/BrandSkeleton/BrandSkeleton";

import ProductSkeleton from "../../components/ui/Skeleton/ProductSkeleton/ProductSkeleton";

// =====================================================
// COMMON COMPONENTS
// =====================================================

import ErrorState from "../../components/Common/ErrorState/ErrorState";

import EmptyState from "../../components/Common/EmptyState/EmptyState";

// =====================================================
// CONSTANTS
// =====================================================

const STORAGE_URL =
    "http://127.0.0.1:8000/storage";

// =====================================================
// COMPONENT
// =====================================================

const Home = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // =================================================
    // BANNER STATE
    // =================================================

    const banners = useSelector(
        selectBanners
    );

    const bannerLoading = useSelector(
        selectBannerLoading
    );

    const bannerError = useSelector(
        selectBannerError
    );

    // =================================================
    // CATEGORY STATE
    // =================================================

    const categories = useSelector(
        selectCategories
    );

    const categoryLoading = useSelector(
        selectCategoryLoading
    );

    const categoryError = useSelector(
        selectCategoryError
    );

    // =================================================
    // BRAND STATE
    // =================================================

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
    // PRODUCT STATE
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

    // =================================================
    // FETCH HOME DATA
    // =================================================

    useEffect(() => {
        dispatch(fetchBanners());
        dispatch(getCategories());
        dispatch(fetchBrands());
        dispatch(fetchProducts());
    }, [dispatch]);

    // =================================================
    // CATEGORY CLICK
    // =================================================

    const handleCategoryClick = (
        category
    ) => {
        if (!category?.id) {
            return;
        }

        navigate(
            `/categories/${category.id}/products`
        );
    };

    // =================================================
    // PRODUCT IMAGE
    // =================================================

    const getImage = (product) => {
        let imagePath = null;

        // ---------------------------------------------
        // PRODUCT IMAGES
        // ---------------------------------------------

        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {
            const firstImage =
                product.images[0];

            if (
                typeof firstImage ===
                "string"
            ) {
                imagePath = firstImage;
            } else {
                imagePath =
                    firstImage?.image ||
                    firstImage?.url ||
                    firstImage?.path;
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
        // STORAGE/ PATH
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
    // DISCOUNT PERCENTAGE
    // =================================================

    const getDiscountPercentage = (
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

        if (
            price <= 0 ||
            discountPrice <= 0 ||
            discountPrice >= price
        ) {
            return 0;
        }

        return Math.round(
            ((price - discountPrice) /
                price) *
                100
        );
    };

    // =================================================
    // SAFE PRODUCTS
    // =================================================

    const safeProducts =
        Array.isArray(products)
            ? products
            : [];

    // =================================================
    // FEATURED PRODUCTS
    // =================================================

    const featuredProducts =
        useMemo(() => {
            return safeProducts
                .filter(
                    (product) =>
                        product?.featured ===
                            true ||
                        product?.featured ===
                            1 ||
                        product?.featured ===
                            "1"
                )
                .slice(0, 8);
        }, [safeProducts]);

    // =================================================
    // LATEST PRODUCTS
    // =================================================

    const latestProducts =
        useMemo(() => {
            return [...safeProducts]
                .sort((a, b) => {
                    const dateA =
                        new Date(
                            a?.created_at ||
                                0
                        ).getTime();

                    const dateB =
                        new Date(
                            b?.created_at ||
                                0
                        ).getTime();

                    return dateB - dateA;
                })
                .slice(0, 8);
        }, [safeProducts]);

    // =================================================
    // BEST SELLERS
    // =================================================

    const bestSellers =
        useMemo(() => {
            return [...safeProducts]
                .sort((a, b) => {
                    const salesA =
                        Number(
                            a?.sales_count ||
                                0
                        );

                    const salesB =
                        Number(
                            b?.sales_count ||
                                0
                        );

                    return salesB - salesA;
                })
                .slice(0, 8);
        }, [safeProducts]);

    // =================================================
    // NEW ARRIVALS
    // =================================================

    const newArrivals =
        useMemo(() => {
            return [...safeProducts]
                .sort((a, b) => {
                    const dateA =
                        new Date(
                            a?.created_at ||
                                0
                        ).getTime();

                    const dateB =
                        new Date(
                            b?.created_at ||
                                0
                        ).getTime();

                    return dateB - dateA;
                })
                .slice(0, 8);
        }, [safeProducts]);

    // =================================================
    // PRODUCT GRID
    // =================================================

    const productGridClass =
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                HERO BANNER
            ================================================= */}

            <section className="relative overflow-hidden">

                <div
                    className="
                        absolute
                        inset-0
                        pointer-events-none
                        bg-gradient-to-br
                        from-indigo-50
                        via-white
                        to-purple-50
                    "
                />

                <div className="relative">

                    {bannerLoading ? (
                        <BannerSkeleton />
                    ) : bannerError ? (
                        <ErrorState
                            message={
                                bannerError
                            }
                        />
                    ) : Array.isArray(
                          banners
                      ) &&
                      banners.length > 0 ? (
                        <BannerList
                            banners={
                                banners
                            }
                        />
                    ) : (
                        <EmptyState
                            title="No Banner Found"
                            subtitle="Promotional banners will appear here."
                        />
                    )}

                </div>
            </section>

            {/* =================================================
                CATEGORIES
            ================================================= */}

            <section className="relative py-16">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Heading */}

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-xl
                                        bg-indigo-100
                                        text-indigo-600
                                    "
                                >
                                    <ShoppingBag
                                        fontSize="small"
                                    />
                                </span>

                                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                                    Explore
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Shop by Category
                            </h2>

                            <p className="text-slate-500 mt-3 max-w-xl">
                                Discover products
                                organized into
                                categories made
                                for easy shopping.
                            </p>

                        </div>

                        <Button
                            component={
                                Link
                            }
                            to="/categories"
                            variant="outlined"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                borderRadius:
                                    "12px",
                                textTransform:
                                    "none",
                                fontWeight:
                                    600,
                                px: 2.5,
                            }}
                        >
                            View All
                        </Button>

                    </div>

                    {/* Category Content */}

                    {categoryLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

                            {Array.from({
                                length: 6,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <CategorySkeleton
                                        key={
                                            index
                                        }
                                    />
                                )
                            )}

                        </div>
                    ) : categoryError ? (
                        <ErrorState
                            message={
                                categoryError
                            }
                        />
                    ) : !Array.isArray(
                          categories
                      ) ||
                      categories.length ===
                          0 ? (
                        <EmptyState
                            title="No Categories Found"
                            subtitle="Categories will appear here."
                        />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

                            {categories
                                .slice(0, 6)
                                .map(
                                    (
                                        category
                                    ) => (
                                        <div
                                            key={
                                                category.id
                                            }
                                            className="
                                                group
                                                transition-all
                                                duration-300
                                                hover:-translate-y-2
                                            "
                                        >
                                            <CategoryCard
                                                category={
                                                    category
                                                }
                                                onClick={
                                                    handleCategoryClick
                                                }
                                                mini
                                            />
                                        </div>
                                    )
                                )}

                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                BRANDS
            ================================================= */}

            <section className="relative bg-white py-16 overflow-hidden">

                <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

                <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-xl
                                        bg-purple-100
                                        text-purple-600
                                    "
                                >
                                    <AutoAwesome
                                        fontSize="small"
                                    />
                                </span>

                                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                                    Trusted
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Featured Brands
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Shop products
                                from brands
                                customers trust.
                            </p>

                        </div>

                        <Button
                            component={
                                Link
                            }
                            to="/brands"
                            variant="outlined"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                borderRadius:
                                    "12px",
                                textTransform:
                                    "none",
                                fontWeight:
                                    600,
                                px: 2.5,
                            }}
                        >
                            View All
                        </Button>

                    </div>

                    {brandLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">

                            {Array.from({
                                length: 8,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <BrandSkeleton
                                        key={
                                            index
                                        }
                                    />
                                )
                            )}

                        </div>
                    ) : brandError ? (
                        <ErrorState
                            message={
                                brandError
                            }
                        />
                    ) : !Array.isArray(
                          brands
                      ) ||
                      brands.length ===
                          0 ? (
                        <EmptyState
                            title="No Brands Found"
                            subtitle="Brands will appear here."
                        />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">

                            {brands
                                .slice(0, 8)
                                .map(
                                    (
                                        brand
                                    ) => (
                                        <div
                                            key={
                                                brand.id
                                            }
                                            className="
                                                transition-all
                                                duration-300
                                                hover:-translate-y-2
                                            "
                                        >
                                            <BrandCard
                                                brand={
                                                    brand
                                                }
                                            />
                                        </div>
                                    )
                                )}

                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                FEATURED PRODUCTS
            ================================================= */}

            <section className="relative py-16">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-xl
                                        bg-amber-100
                                        text-amber-600
                                    "
                                >
                                    <Star
                                        fontSize="small"
                                    />
                                </span>

                                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                                    Recommended
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Featured Products
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Hand-picked
                                products
                                specially
                                selected for
                                you.
                            </p>

                        </div>

                        <Button
                            component={
                                Link
                            }
                            to="/shop?featured=1"
                            variant="outlined"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                borderRadius:
                                    "12px",
                                textTransform:
                                    "none",
                                fontWeight:
                                    600,
                                px: 2.5,
                            }}
                        >
                            View All
                        </Button>

                    </div>

                    {productLoading ? (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {Array.from({
                                length: 8,
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
                    ) : featuredProducts.length ===
                      0 ? (
                        <EmptyState
                            title="No Featured Products"
                            subtitle="Featured products will appear here."
                        />
                    ) : (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {featuredProducts.map(
                                (
                                    product
                                ) => (
                                    <div
                                        key={
                                            product.id
                                        }
                                        className="
                                            transition-all
                                            duration-500
                                            hover:-translate-y-2
                                            hover:drop-shadow-2xl
                                        "
                                    >
                                        <ProductCard
                                            product={
                                                product
                                            }
                                            image={getImage(
                                                product
                                            )}
                                            discount={getDiscountPercentage(
                                                product
                                            )}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                LATEST PRODUCTS
            ================================================= */}

            <section className="bg-white py-16">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-xl
                                        bg-blue-100
                                        text-blue-600
                                    "
                                >
                                    <AutoAwesome
                                        fontSize="small"
                                    />
                                </span>

                                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                    Just Added
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Latest Products
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Discover our
                                newest
                                products and
                                latest
                                arrivals.
                            </p>

                        </div>

                        <Button
                            component={
                                Link
                            }
                            to="/shop?sort=newest"
                            variant="outlined"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                borderRadius:
                                    "12px",
                                textTransform:
                                    "none",
                                fontWeight:
                                    600,
                                px: 2.5,
                            }}
                        >
                            View All
                        </Button>

                    </div>

                    {productLoading ? (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {Array.from({
                                length: 8,
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
                    ) : latestProducts.length ===
                      0 ? (
                        <EmptyState
                            title="No Latest Products"
                            subtitle="Latest products will appear here."
                        />
                    ) : (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {latestProducts.map(
                                (
                                    product
                                ) => (
                                    <div
                                        key={
                                            product.id
                                        }
                                        className="
                                            transition-all
                                            duration-500
                                            hover:-translate-y-2
                                            hover:drop-shadow-2xl
                                        "
                                    >
                                        <ProductCard
                                            product={
                                                product
                                            }
                                            image={getImage(
                                                product
                                            )}
                                            discount={getDiscountPercentage(
                                                product
                                            )}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                BEST SELLERS
            ================================================= */}

            <section className="py-16 bg-slate-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-xl
                                        bg-rose-100
                                        text-rose-600
                                    "
                                >
                                    <Star
                                        fontSize="small"
                                    />
                                </span>

                                <span className="text-sm font-semibold text-rose-600 uppercase tracking-wider">
                                    Popular
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Best Sellers
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Our most popular
                                products loved
                                by customers.
                            </p>

                        </div>

                        <Button
                            component={
                                Link
                            }
                            to="/shop?sort=best-selling"
                            variant="outlined"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                borderRadius:
                                    "12px",
                                textTransform:
                                    "none",
                                fontWeight:
                                    600,
                                px: 2.5,
                            }}
                        >
                            View All
                        </Button>

                    </div>

                    {productLoading ? (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {Array.from({
                                length: 8,
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
                    ) : bestSellers.length ===
                      0 ? (
                        <EmptyState
                            title="No Best Sellers Found"
                            subtitle="Best selling products will appear here."
                        />
                    ) : (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {bestSellers.map(
                                (
                                    product
                                ) => (
                                    <div
                                        key={
                                            product.id
                                        }
                                        className="
                                            transition-all
                                            duration-500
                                            hover:-translate-y-2
                                            hover:drop-shadow-2xl
                                        "
                                    >
                                        <ProductCard
                                            product={
                                                product
                                            }
                                            image={getImage(
                                                product
                                            )}
                                            discount={getDiscountPercentage(
                                                product
                                            )}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                NEW ARRIVALS
            ================================================= */}

            <section className="bg-white py-16">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-xl
                                        bg-emerald-100
                                        text-emerald-600
                                    "
                                >
                                    <AutoAwesome
                                        fontSize="small"
                                    />
                                </span>

                                <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                                    Fresh
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                New Arrivals
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Freshly added
                                products
                                waiting for
                                you.
                            </p>

                        </div>

                        <Button
                            component={
                                Link
                            }
                            to="/shop?sort=newest"
                            variant="outlined"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                borderRadius:
                                    "12px",
                                textTransform:
                                    "none",
                                fontWeight:
                                    600,
                                px: 2.5,
                            }}
                        >
                            View All
                        </Button>

                    </div>

                    {productLoading ? (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {Array.from({
                                length: 8,
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
                    ) : newArrivals.length ===
                      0 ? (
                        <EmptyState
                            title="No New Arrivals"
                            subtitle="New products will appear here."
                        />
                    ) : (
                        <div
                            className={
                                productGridClass
                            }
                        >
                            {newArrivals.map(
                                (
                                    product
                                ) => (
                                    <div
                                        key={
                                            product.id
                                        }
                                        className="
                                            transition-all
                                            duration-500
                                            hover:-translate-y-2
                                            hover:drop-shadow-2xl
                                        "
                                    >
                                        <ProductCard
                                            product={
                                                product
                                            }
                                            image={getImage(
                                                product
                                            )}
                                            discount={getDiscountPercentage(
                                                product
                                            )}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                WHY CHOOSE US
            ================================================= */}

            <section className="relative py-20 overflow-hidden bg-slate-900">

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950" />

                <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

                <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-14">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-indigo-200 text-sm font-medium mb-5">

                            <AutoAwesome
                                fontSize="small"
                            />

                            Why Shop With Us?

                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            A Better Shopping
                            Experience
                        </h2>

                        <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
                            Everything you need
                            for a simple,
                            secure and
                            enjoyable online
                            shopping
                            experience.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Card 1 */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                backdrop-blur-md
                                p-7
                                text-center
                                transition-all
                                duration-500
                                hover:-translate-y-3
                                hover:bg-white/10
                                hover:shadow-2xl
                            "
                        >

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">

                                <LocalShipping fontSize="large" />

                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">
                                Fast Delivery
                            </h3>

                            <p className="text-slate-300 leading-relaxed">
                                Quick and reliable
                                delivery for your
                                eligible orders.
                            </p>

                        </div>

                        {/* Card 2 */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                backdrop-blur-md
                                p-7
                                text-center
                                transition-all
                                duration-500
                                hover:-translate-y-3
                                hover:bg-white/10
                                hover:shadow-2xl
                            "
                        >

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">

                                <Security fontSize="large" />

                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">
                                Secure Payments
                            </h3>

                            <p className="text-slate-300 leading-relaxed">
                                Your payment
                                information is
                                handled securely.
                            </p>

                        </div>

                        {/* Card 3 */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                backdrop-blur-md
                                p-7
                                text-center
                                transition-all
                                duration-500
                                hover:-translate-y-3
                                hover:bg-white/10
                                hover:shadow-2xl
                            "
                        >

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">

                                <Star fontSize="large" />

                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">
                                Quality Products
                            </h3>

                            <p className="text-slate-300 leading-relaxed">
                                Carefully selected
                                products from
                                trusted brands.
                            </p>

                        </div>

                        {/* Card 4 */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                backdrop-blur-md
                                p-7
                                text-center
                                transition-all
                                duration-500
                                hover:-translate-y-3
                                hover:bg-white/10
                                hover:shadow-2xl
                            "
                        >

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">

                                <SupportAgent fontSize="large" />

                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">
                                Customer Support
                            </h3>

                            <p className="text-slate-300 leading-relaxed">
                                Friendly support
                                whenever you need
                                assistance.
                            </p>

                        </div>

                    </div>

                </div>
            </section>

            {/* =================================================
                NEWSLETTER
            ================================================= */}

            <section className="relative py-20 overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700" />

                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-300/20 blur-2xl" />

                <div className="relative max-w-4xl mx-auto px-4 text-center">

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white mb-6">

                        <AutoAwesome fontSize="large" />

                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        Stay in the Loop
                    </h2>

                    <p className="text-indigo-100 mt-4 mb-8 max-w-2xl mx-auto text-lg">
                        Subscribe to receive
                        updates about new
                        products, exclusive
                        offers and special
                        discounts.
                    </p>

                    <form
                        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
                        onSubmit={(
                            event
                        ) => {
                            event.preventDefault();
                        }}
                    >

                        <input
                            type="email"
                            placeholder="Enter your email address"
                            aria-label="Email address"
                            required
                            className="
                                flex-1
                                px-5
                                py-4
                                rounded-xl
                                bg-white
                                text-slate-800
                                placeholder:text-slate-400
                                outline-none
                                border
                                border-white/20
                                focus:ring-4
                                focus:ring-white/20
                            "
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.8,
                                borderRadius:
                                    "12px",
                                backgroundColor:
                                    "white",
                                color:
                                    "#4338ca",
                                fontWeight:
                                    700,
                                textTransform:
                                    "none",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.15)",
                                "&:hover":
                                    {
                                        backgroundColor:
                                            "#f8fafc",
                                        transform:
                                            "translateY(-2px)",
                                    },
                            }}
                        >
                            Subscribe
                        </Button>

                    </form>

                </div>
            </section>

        </div>
    );
};

// =====================================================
// EXPORT
// =====================================================

export default Home;