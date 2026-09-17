import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Typography,
    Chip,
    Alert,
} from "@mui/material";


import ArrowBackIcon from "@mui/icons-material/ArrowBack";


import {
    getBanner,
    clearBannerMessage,
} from "../../../redux/admin/bannerSlice";



const ViewBanner = () => {


    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();



    const {
        banner,
        loading,
        error,
    } = useSelector(
        (state) => state.adminBanner
    );




    useEffect(() => {

        if (id) {

            dispatch(
                getBanner(id)
            );

        }

    }, [
        dispatch,
        id
    ]);





    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >

                <CircularProgress />

            </Box>

        );

    }





    if (error) {

        return (

            <Container maxWidth="md">

                <Alert severity="error">

                    {error}

                </Alert>


            </Container>

        );

    }





    if (!banner) {

        return (

            <Container maxWidth="md">

                <Alert severity="warning">

                    Banner not found

                </Alert>


            </Container>

        );

    }





    return (

        <Container maxWidth="md">


            <Box

                display="flex"

                justifyContent="space-between"

                alignItems="center"

                mb={3}

            >


                <Typography

                    variant="h4"

                    fontWeight="bold"

                >

                    Banner Details

                </Typography>



                <Button

                    variant="outlined"

                    startIcon={
                        <ArrowBackIcon />
                    }

                    onClick={() =>
                        navigate(
                            "/admin/banners"
                        )
                    }

                >

                    Back

                </Button>



            </Box>





            <Card>


                <CardContent>



                    <Grid
                        container
                        spacing={3}
                    >



                        {/* Banner Image */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box

                                display="flex"

                                justifyContent="center"

                            >

                                <img

                                    src={
                                        banner.image
                                    }

                                    alt={
                                        banner.title ||
                                        "Banner"
                                    }

                                    style={{

                                        width:"100%",

                                        maxHeight:"350px",

                                        objectFit:"cover",

                                        borderRadius:"8px"

                                    }}

                                />


                            </Box>


                        </Grid>





                        <Grid
                            item
                            xs={12}
                        >

                            <Divider />

                        </Grid>






                        {/* Title */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Title

                            </Typography>


                            <Typography
                                fontWeight={600}
                            >

                                {
                                    banner.title ||
                                    "-"
                                }

                            </Typography>


                        </Grid>





                        {/* Status */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Status

                            </Typography>


                            <Chip

                                label={
                                    banner.status
                                        ? "Active"
                                        : "Inactive"
                                }

                                color={
                                    banner.status
                                        ? "success"
                                        : "error"
                                }

                                size="small"

                            />


                        </Grid>






                        {/* Link */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Redirect Link

                            </Typography>


                            <Typography>

                                {
                                    banner.link ||
                                    "-"
                                }

                            </Typography>


                        </Grid>







                        {/* Position */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Position

                            </Typography>


                            <Typography>

                                {
                                    banner.position
                                }

                            </Typography>


                        </Grid>







                        {/* Created Date */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Created At

                            </Typography>


                            <Typography>

                                {
                                    new Date(
                                        banner.created_at
                                    )
                                    .toLocaleDateString()
                                }

                            </Typography>


                        </Grid>





                        {/* Updated Date */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Updated At

                            </Typography>


                            <Typography>

                                {
                                    new Date(
                                        banner.updated_at
                                    )
                                    .toLocaleDateString()
                                }

                            </Typography>


                        </Grid>




                    </Grid>



                </CardContent>


            </Card>



        </Container>

    );

};


export default ViewBanner;