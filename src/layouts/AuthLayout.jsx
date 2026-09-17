// src/layouts/AuthLayout.jsx

import { Outlet } from "react-router-dom";

import {
    Box,
    Container,
    Paper,
    Typography,
} from "@mui/material";

const AuthLayout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f4f6f8",
                background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                p: 2,
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={10}
                    sx={{
                        width: "100%",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}

                    <Box
                        sx={{
                            bgcolor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                            py: 4,
                            px: 3,
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            E-Commerce
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                opacity: 0.9,
                            }}
                        >
                            Welcome Back
                        </Typography>
                    </Box>

                    {/* Authentication Pages */}

                    <Box
                        sx={{
                            p: {
                                xs: 3,
                                sm: 4,
                            },
                        }}
                    >
                        <Outlet />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLayout;