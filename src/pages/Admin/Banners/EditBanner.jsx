import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Typography,
    Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BannerForm from "../../../components/admin/banner/BannerForm";

import {
    getBanner,
    updateBanner,
    clearBannerMessage,
} from "../../../redux/admin/bannerSlice";


const EditBanner = () => {

    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const {
        banner,
        loading,
        error,
        successMessage,
    } = useSelector(
        (state) => state.adminBanner
    );


    const [formData, setFormData] = useState({
        title: "",
        image: "",
        link: "",
        status: true,
        position: 0,
    });



    // Fetch banner
    useEffect(() => {

        if (id) {
            dispatch(getBanner(id));
        }

    }, [dispatch, id]);



    // Set existing data
    useEffect(() => {

        if (banner) {

            setFormData({

                title:
                    banner.title || "",

                image:
                    banner.image || "",

                link:
                    banner.link || "",

                status:
                    banner.status ?? true,

                position:
                    banner.position ?? 0,

            });

        }

    }, [banner]);



    // Clear message
    useEffect(() => {

        if (successMessage) {

            const timer =
                setTimeout(() => {

                    dispatch(
                        clearBannerMessage()
                    );

                }, 3000);


            return () =>
                clearTimeout(timer);

        }

    }, [
        successMessage,
        dispatch
    ]);




    const handleChange = (e) => {

        const {
            name,
            value,
            checked,
            type,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };




    const handleSubmit = (e) => {

        e.preventDefault();


       dispatch(
    updateBanner({
        id,
        bannerData: formData,
    })
)
        .unwrap()
        .then(() => {

            navigate(
                "/admin/banners"
            );

        });

    };




    if (loading && !banner) {

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
                    Edit Banner
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



            {
                error && (

                    <Alert
                        severity="error"
                        sx={{ mb:2 }}
                    >

                        {error}

                    </Alert>

                )
            }




            {
                successMessage && (

                    <Alert
                        severity="success"
                        sx={{ mb:2 }}
                    >

                        {successMessage}

                    </Alert>

                )
            }





            <Card>


                <CardContent>

<BannerForm
    initialValues={formData}
    loading={loading}
    submitLabel="Update Banner"
    onSubmit={(data) =>
        dispatch(
            updateBanner({
                id,
                bannerData: data,
            })
        )
            .unwrap()
            .then(() => navigate("/admin/banners"))
    }
/>


                </CardContent>


            </Card>



        </Container>

    );

};


export default EditBanner;