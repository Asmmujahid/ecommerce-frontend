// src/components/Navbar/Navbar.jsx

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Divider,
    TextField,
    Paper,
    ListItemAvatar,
    Avatar,
    InputAdornment,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import {
    fetchWishlist,
    selectWishlistItems,
} from "../../redux/customer/wishlistSlice";

import {
    fetchCart,
    selectCartItems,
} from "../../redux/customer/cartSlice";

import {
    fetchProducts,
    selectProducts,
} from "../../redux/customer/productSlice";

import {
    getCustomerProfile,
} from "../../redux/customer/profileSlice";

import {
    selectAuthUser,
    selectIsAuthenticated,
} from "../../redux/authSlice";

import { STORAGE_URL } from "../../utils/storage";

// =====================================================
// COMPONENT
// =====================================================

const Navbar = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    // =================================================
    // LOCAL STATE
    // =================================================

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [searchFocused, setSearchFocused] =
        useState(false);

    // =================================================
    // AUTH STATE
    // =================================================

    const token =
        localStorage.getItem("token");

    const isAuthenticated = useSelector(
        selectIsAuthenticated
    );

    const user = useSelector(
        selectAuthUser
    );

    // =================================================
    // HOME PAGE
    // =================================================

    const isHomePage =
        location.pathname === "/";

    // =================================================
    // REDUX STATE
    // =================================================

    const wishlistItems =
        useSelector(
            selectWishlistItems
        );

    const cartItems =
        useSelector(
            selectCartItems
        );

    const products =
        useSelector(
            selectProducts
        );

    // =================================================
    // FETCH CUSTOMER PROFILE
    // =================================================
    /*
     * IMPORTANT:
     *
     * This loads the latest customer profile when
     * Navbar is mounted.
     *
     * The profile contains:
     *
     * user.avatar
     *
     * and updateUser() stores it inside auth.user.
     */

    useEffect(() => {
        if (!token) {
            return;
        }

        dispatch(
            getCustomerProfile()
        );
    }, [dispatch, token]);

    // =================================================
    // FETCH CART + WISHLIST
    // =================================================

    useEffect(() => {
        if (!token) {
            return;
        }

        dispatch(
            fetchWishlist()
        );

        dispatch(
            fetchCart()
        );
    }, [dispatch, token]);

    // =================================================
    // FETCH PRODUCTS FOR HOME SEARCH
    // =================================================

    useEffect(() => {
        if (!isHomePage) {
            return;
        }

        dispatch(
            fetchProducts()
        );
    }, [
        dispatch,
        isHomePage,
    ]);

    // =================================================
    // SAFE PRODUCTS
    // =================================================

    const safeProducts =
        Array.isArray(products)
            ? products
            : [];

    // =================================================
    // SEARCH SUGGESTIONS
    // =================================================

    const searchSuggestions =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return [];
            }

            return safeProducts
                .filter(
                    (product) => {
                        const name =
                            String(
                                product?.name ||
                                    ""
                            ).toLowerCase();

                        const category =
                            String(
                                product
                                    ?.category
                                    ?.name ||
                                    ""
                            ).toLowerCase();

                        const brand =
                            String(
                                product
                                    ?.brand
                                    ?.name ||
                                    ""
                            ).toLowerCase();

                        const shortDescription =
                            String(
                                product
                                    ?.short_description ||
                                    ""
                            ).toLowerCase();

                        return (
                            name.includes(
                                keyword
                            ) ||
                            category.includes(
                                keyword
                            ) ||
                            brand.includes(
                                keyword
                            ) ||
                            shortDescription.includes(
                                keyword
                            )
                        );
                    }
                )
                .slice(0, 6);
        }, [
            safeProducts,
            search,
        ]);

    // =================================================
    // SEARCH SUBMIT
    // =================================================

    const handleSearchSubmit = (
        event
    ) => {
        event.preventDefault();

        const keyword =
            search.trim();

        if (!keyword) {
            return;
        }

        setSearchFocused(false);

        navigate(
            `/shop?search=${encodeURIComponent(
                keyword
            )}`
        );
    };

    // =================================================
    // SEARCH SUGGESTION CLICK
    // =================================================

    const handleSuggestionClick = (
        product
    ) => {
        if (!product?.name) {
            return;
        }

        const keyword =
            product.name.trim();

        setSearch(keyword);

        setSearchFocused(false);

        navigate(
            `/shop?search=${encodeURIComponent(
                keyword
            )}`
        );
    };

    // =================================================
    // CLOSE DRAWER
    // =================================================

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "role"
        );

        setDrawerOpen(false);

        window.location.href = "/";
    };

    // =================================================
    // PRODUCT IMAGE
    // =================================================

    const getProductImage = (
        product
    ) => {
        let imagePath = null;

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
            } else {
                imagePath =
                    firstImage?.image ||
                    firstImage?.url ||
                    firstImage?.path;
            }
        }

        if (
            !imagePath &&
            product?.thumbnail
        ) {
            imagePath =
                product.thumbnail;
        }

        if (!imagePath) {
            return "/images/no-image.png";
        }

        const cleanPath =
            String(imagePath)
                .trim()
                .replace(
                    /^\/+/,
                    ""
                );

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

        if (
            cleanPath.startsWith(
                "storage/"
            )
        ) {
            return `${STORAGE_URL.replace(
        /\/storage$/,
        ""
    )}/${cleanPath}`;
        }

        return `${STORAGE_URL}/${cleanPath}`;
    };

    // =================================================
    // CUSTOMER AVATAR
    // =================================================
    /*
     * Backend returns:
     *
     * avatar:
     * `${STORAGE_URL}/avatars/xxx.jpg
     *
     * Therefore we use the URL directly.
     */

    const getUserAvatar = () => {
        const avatar =
            user?.avatar;

        if (!avatar) {
            return "";
        }

        const avatarUrl =
            String(avatar).trim();

        if (
            avatarUrl.startsWith(
                "http://"
            ) ||
            avatarUrl.startsWith(
                "https://"
            )
        ) {
            return avatarUrl;
        }

        /*
         * Fallback if backend sends only
         * a relative path.
         */

        const cleanPath =
            avatarUrl.replace(
                /^\/+/,
                ""
            );

        if (
            cleanPath.startsWith(
                "storage/"
            )
        ) {
            return `${STORAGE_URL.replace(
        /\/storage$/,
        ""
    )}/${cleanPath}`;
        }

        return `${STORAGE_URL}/${cleanPath}`;
    };

    const userAvatar =
        getUserAvatar();

    // =================================================
    // USER DISPLAY NAME
    // =================================================

    const userName =
        user?.name ||
        user?.first_name ||
        "Customer";

    // =================================================
    // COUNTS
    // =================================================

    const wishlistCount =
        Array.isArray(
            wishlistItems
        )
            ? wishlistItems.length
            : 0;

    const cartCount =
        Array.isArray(
            cartItems
        )
            ? cartItems.reduce(
                  (
                      total,
                      item
                  ) =>
                      total +
                      Number(
                          item?.quantity ??
                              0
                      ),
                  0
              )
            : 0;

    // =================================================
    // RENDER
    // =================================================

    return (
        <>
            {/* =================================================
                APP BAR
            ================================================= */}

            <AppBar
                position="sticky"
            >
                <Toolbar
                    sx={{
                        gap: 2,
                        position:
                            "relative",
                    }}
                >
                    {/* =================================================
                        MOBILE MENU
                    ================================================= */}

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open menu"
                        onClick={() =>
                            setDrawerOpen(
                                true
                            )
                        }
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <Typography
                        component={Link}
                        to="/"
                        variant="h5"
                        sx={{
                            color: "#fff",
                            textDecoration:
                                "none",
                            fontWeight:
                                "bold",
                            whiteSpace:
                                "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        E-Commerce
                    </Typography>

                    {/* =================================================
                        HOME SEARCH
                    ================================================= */}

                    {isHomePage && (
                        <Box
                            component="form"
                            onSubmit={
                                handleSearchSubmit
                            }
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "block",
                                },
                                flex: 1,
                                maxWidth: 520,
                                mx: "auto",
                                position:
                                    "relative",
                            }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                value={
                                    search
                                }
                                placeholder="Search products..."
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onFocus={() =>
                                    setSearchFocused(
                                        true
                                    )
                                }
                                onBlur={() => {
                                    setTimeout(
                                        () =>
                                            setSearchFocused(
                                                false
                                            ),
                                        150
                                    );
                                }}
                                InputProps={{
                                    startAdornment:
                                        (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    sx={{
                                                        color: "text.secondary",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),

                                    endAdornment:
                                        search && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onMouseDown={(
                                                        event
                                                    ) =>
                                                        event.preventDefault()
                                                    }
                                                    onClick={() =>
                                                        setSearch(
                                                            ""
                                                        )
                                                    }
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                }}
                                sx={{
                                    backgroundColor:
                                        "#fff",
                                    borderRadius: 1,

                                    "& .MuiOutlinedInput-root":
                                        {
                                            borderRadius: 1,
                                        },
                                }}
                            />

                            {/* =================================================
                                SEARCH SUGGESTIONS
                            ================================================= */}

                            {searchFocused &&
                                search.trim() &&
                                searchSuggestions.length >
                                    0 && (
                                    <Paper
                                        elevation={
                                            8
                                        }
                                        sx={{
                                            position:
                                                "absolute",
                                            top: "calc(100% + 8px)",
                                            left: 0,
                                            right: 0,
                                            zIndex: 1500,
                                            overflow:
                                                "hidden",
                                            borderRadius:
                                                2,
                                        }}
                                    >
                                        <List disablePadding>
                                            {searchSuggestions.map(
                                                (
                                                    product
                                                ) => (
                                                    <ListItem
                                                        key={
                                                            product.id
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton
                                                            onClick={() =>
                                                                handleSuggestionClick(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar
                                                                    variant="rounded"
                                                                    src={getProductImage(
                                                                        product
                                                                    )}
                                                                    alt={
                                                                        product.name ||
                                                                        "Product"
                                                                    }
                                                                />
                                                            </ListItemAvatar>

                                                            <ListItemText
                                                                primary={
                                                                    product.name
                                                                }
                                                                secondary={
                                                                    product
                                                                        ?.category
                                                                        ?.name ||
                                                                    product
                                                                        ?.brand
                                                                        ?.name ||
                                                                    ""
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            )}

                                            <Divider />

                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={() => {
                                                        const keyword =
                                                            search.trim();

                                                        if (
                                                            keyword
                                                        ) {
                                                            setSearchFocused(
                                                                false
                                                            );

                                                            navigate(
                                                                `/shop?search=${encodeURIComponent(
                                                                    keyword
                                                                )}`
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <SearchIcon
                                                        sx={{
                                                            mr: 2,
                                                        }}
                                                    />

                                                    <ListItemText
                                                        primary={`Search all products for "${search.trim()}"`}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Paper>
                                )}

                            {/* =================================================
                                NO SEARCH RESULTS
                            ================================================= */}

                            {searchFocused &&
                                search.trim() &&
                                searchSuggestions.length ===
                                    0 && (
                                    <Paper
                                        elevation={
                                            8
                                        }
                                        sx={{
                                            position:
                                                "absolute",
                                            top: "calc(100% + 8px)",
                                            left: 0,
                                            right: 0,
                                            zIndex: 1500,
                                            borderRadius:
                                                2,
                                            p: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No matching
                                            products
                                            found.
                                        </Typography>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                mt: 1.5,
                                            }}
                                            onClick={() => {
                                                const keyword =
                                                    search.trim();

                                                if (
                                                    keyword
                                                ) {
                                                    setSearchFocused(
                                                        false
                                                    );

                                                    navigate(
                                                        `/shop?search=${encodeURIComponent(
                                                            keyword
                                                        )}`
                                                    );
                                                }
                                            }}
                                        >
                                            Search all
                                            products
                                        </Button>
                                    </Paper>
                                )}
                        </Box>
                    )}

                    {/* =================================================
                        DESKTOP MENU
                    ================================================= */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                            alignItems:
                                "center",
                            gap: 0.5,
                        }}
                    >
                        <Button
                            color="inherit"
                            component={Link}
                            to="/"
                        >
                            Home
                        </Button>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/shop"
                            startIcon={
                                <StorefrontIcon />
                            }
                        >
                            Shop
                        </Button>
                    </Box>

                    {/* =================================================
                        AUTHENTICATED USER
                    ================================================= */}

                    {token &&
                    isAuthenticated ? (
                        <>
                            {/* =================================================
                                WISHLIST
                            ================================================= */}

                            <IconButton
                                color="inherit"
                                component={Link}
                                to="/customer/wishlist"
                                aria-label="wishlist"
                            >
                                <Badge
                                    badgeContent={
                                        wishlistCount
                                    }
                                    color="error"
                                    showZero
                                >
                                    <FavoriteBorderIcon />
                                </Badge>
                            </IconButton>

                            {/* =================================================
                                CART
                            ================================================= */}

                            <IconButton
                                color="inherit"
                                component={Link}
                                to="/cart"
                                aria-label="cart"
                            >
                                <Badge
                                    badgeContent={
                                        cartCount
                                    }
                                    color="error"
                                    showZero
                                >
                                    <ShoppingCartOutlinedIcon />
                                </Badge>
                            </IconButton>

                            {/* =================================================
                                CUSTOMER PROFILE
                            ================================================= */}

                            <IconButton
                                component={Link}
                                to="/customer/profile"
                                aria-label={`${userName} profile`}
                                sx={{
                                    p: 0.5,
                                }}
                            >
                                <Avatar
                                    src={
                                        userAvatar ||
                                        undefined
                                    }
                                    alt={
                                        userName
                                    }
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        border:
                                            "2px solid white",
                                    }}
                                >
                                    {!userAvatar &&
                                        userName
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </>
                    ) : (
                        <>
                            {/* =================================================
                                LOGIN
                            ================================================= */}

                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                sx={{
                                    display: {
                                        xs: "none",
                                        md: "inline-flex",
                                    },
                                }}
                            >
                                Login
                            </Button>

                            {/* =================================================
                                REGISTER
                            ================================================= */}

                            <Button
                                variant="contained"
                                color="secondary"
                                component={Link}
                                to="/register"
                                sx={{
                                    display: {
                                        xs: "none",
                                        md: "inline-flex",
                                    },
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* =================================================
                MOBILE DRAWER
            ================================================= */}

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={
                    closeDrawer
                }
            >
                <Box
                    sx={{
                        width: 280,
                    }}
                    role="presentation"
                >
                    <List>
                        {/* =================================================
                            HOME
                        ================================================= */}

                        <ListItem disablePadding>
                            <ListItemButton
                                component={
                                    Link
                                }
                                to="/"
                                onClick={
                                    closeDrawer
                                }
                            >
                                <ListItemText
                                    primary="Home"
                                />
                            </ListItemButton>
                        </ListItem>

                        {/* =================================================
                            SHOP
                        ================================================= */}

                        <ListItem disablePadding>
                            <ListItemButton
                                component={
                                    Link
                                }
                                to="/shop"
                                onClick={
                                    closeDrawer
                                }
                            >
                                <ListItemText
                                    primary="Shop"
                                />
                            </ListItemButton>
                        </ListItem>

                        <Divider />

                        {/* =================================================
                            AUTHENTICATED
                        ================================================= */}

                        {token &&
                        isAuthenticated ? (
                            <>
                                {/* =================================================
                                    MOBILE USER PROFILE
                                ================================================= */}

                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={
                                                userAvatar ||
                                                undefined
                                            }
                                            alt={
                                                userName
                                            }
                                        >
                                            {!userAvatar &&
                                                userName
                                                    ?.charAt(
                                                        0
                                                    )
                                                    ?.toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            userName
                                        }
                                        secondary={
                                            user?.email ||
                                            ""
                                        }
                                    />
                                </ListItem>

                                <Divider />

                                {/* =================================================
                                    WISHLIST
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/customer/wishlist"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary={`Wishlist (${wishlistCount})`}
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    CART
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/cart"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary={`Cart (${cartCount})`}
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    PROFILE
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/customer/profile"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="Profile"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    DASHBOARD
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/customer/dashboard"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="Dashboard"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    ORDERS
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/customer/orders"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="Orders"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    ADDRESSES
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/customer/addresses"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="Addresses"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    REVIEWS
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/customer/reviews"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="My Reviews"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    LOGOUT
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <ListItemText
                                            primary="Logout"
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : (
                            <>
                                {/* =================================================
                                    LOGIN
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/login"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="Login"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                {/* =================================================
                                    REGISTER
                                ================================================= */}

                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={
                                            Link
                                        }
                                        to="/register"
                                        onClick={
                                            closeDrawer
                                        }
                                    >
                                        <ListItemText
                                            primary="Register"
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;