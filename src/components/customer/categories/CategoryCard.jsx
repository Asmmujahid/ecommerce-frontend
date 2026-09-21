
// src/components/customer/categories/CategoryCard.jsx

import { Link } from "react-router-dom";

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";

// =====================================================
// STORAGE URL
// =====================================================

const STORAGE_URL =
    "http://127.0.0.1:8000/storage";

// =====================================================
// IMAGE
// =====================================================

const getCategoryImage = (
    category
) => {
    const image =
        category?.image ||
        category?.thumbnail;

    if (!image) {
        return "/images/no-image.png";
    }

    const imagePath =
        String(image).trim();

    if (
        imagePath.startsWith(
            "http://"
        ) ||
        imagePath.startsWith(
            "https://"
        )
    ) {
        return imagePath;
    }

    if (
        imagePath.startsWith(
            "storage/"
        )
    ) {
        return `http://127.0.0.1:8000/${imagePath}`;
    }

    return `${STORAGE_URL}/${imagePath.replace(
        /^\/+/,
        ""
    )}`;
};

// =====================================================
// COMPONENT
// =====================================================

const CategoryCard = ({
    category,
}) => {
    if (!category?.id) {
        return null;
    }

    const image =
        getCategoryImage(
            category
        );

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor:
                    "grey.200",

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    transform:
                        "translateY(-5px)",
                    boxShadow: 6,
                },
            }}
        >
            <CardActionArea
                component={Link}
                to={`/categories/${category.id}/products`}
                sx={{
                    height: "100%",
                    textDecoration:
                        "none",
                }}
            >
                {/* IMAGE */}

                <CardMedia
                    component="img"
                    image={image}
                    alt={
                        category.name ||
                        "Category"
                    }
                    onError={(
                        event
                    ) => {
                        event.currentTarget.onerror =
                            null;

                        event.currentTarget.src =
                            "/images/no-image.png";
                    }}
                    sx={{
                        height: {
                            xs: 180,
                            sm: 200,
                            md: 220,
                        },
                        objectFit:
                            "cover",
                        backgroundColor:
                            "#f5f5f5",
                    }}
                />

                {/* CONTENT */}

                <CardContent
                    sx={{
                        textAlign:
                            "center",
                        p: 2.5,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        fontWeight={700}
                        color="text.primary"
                    >
                        {category.name ||
                            "Unnamed Category"}
                    </Typography>

                    {category
                        ?.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.8,

                                display:
                                    "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient:
                                    "vertical",
                                overflow:
                                    "hidden",
                            }}
                        >
                            {
                                category.description
                            }
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={700}
                        sx={{
                            mt: 1.5,
                        }}
                    >
                        View Products →
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CategoryCard;

