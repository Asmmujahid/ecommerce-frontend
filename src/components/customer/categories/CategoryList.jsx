// src/components/customer/categories/CategoryList.jsx

import { Box, Grid, Typography } from "@mui/material";


import CategoryCard from "./CategoryCard";

// =====================================================
// Category List
// =====================================================

const CategoryList = ({
    categories = [],
    onCategoryClick,
    limit,
    showHeader = false,
}) => {
    // -------------------------------------------------
    // Categories to display
    // -------------------------------------------------

    const displayedCategories =
        typeof limit === "number"
            ? categories.slice(0, limit)
            : categories;

    // -------------------------------------------------
    // Empty state
    // -------------------------------------------------

    if (!displayedCategories.length) {
        return (
            <Box
                sx={{
                    width: "100%",
                    py: 5,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    No Categories Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    There are currently no categories
                    available.
                </Typography>
            </Box>
        );
    }

    // -------------------------------------------------
    // Render
    // -------------------------------------------------

    return (
        <Box sx={{ width: "100%" }}>
            {/* =========================================
                Optional Header
            ========================================= */}

            {showHeader && (
                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 1,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            component="h2"
                            fontWeight={700}
                        >
                            Categories
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Browse products by
                            category
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {categories.length}{" "}
                        {categories.length === 1
                            ? "Category"
                            : "Categories"}
                    </Typography>
                </Box>
            )}

            {/* =========================================
                Category Grid
            ========================================= */}

            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                }}
            >
                {displayedCategories.map(
                    (category) => (
                        <Grid
                            item
                            key={category.id}
                            xs={6}
                            sm={4}
                            md={3}
                            lg={2}
                        >
                            <CategoryCard
                                category={category}
                                onClick={
                                    onCategoryClick
                                }
                            />
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default CategoryList;