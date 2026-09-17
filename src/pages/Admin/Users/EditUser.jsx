import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControlLabel,
    Switch,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    getUser,
    updateUser,
    resetUserState,
} from "../../../redux/admin/userSlice";

const EditUser = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

const {
    user,
    loading,
    error,
} = useSelector((state) => state.adminUser);


    const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: false,
});



useEffect(() => {
    dispatch(getUser(id));

    return () => {
        dispatch(resetUserState());
    };
}, [dispatch, id]);

useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            status: Boolean(user.status),
        });
    }
}, [user]);

const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

   

    if (loading && !user) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                py={10}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p={3}>
                <Alert severity="warning">
                    User not found.
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                >
                    Edit Customer
                </Typography>

                <Typography
                    color="text.secondary"
                    mb={4}
                >
                    Update customer status.
                </Typography>

                <Box
                    display="grid"
                    gap={3}
                >
                   <TextField
    label="Name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    fullWidth
/>

                  <TextField
    label="Email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    fullWidth
/>

                   <TextField
    label="Phone"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    fullWidth
/>

                    <FormControlLabel
                        control={
                            <Switch
                               checked={formData.status}
                               onChange={(e) =>
    setFormData((prev) => ({
        ...prev,
        status: e.target.checked,
    }))
}
                            />
                        }
                        label={
    formData.status
        ? "Active"
        : "Inactive"
}
                    />

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
                        mt={2}
                    >
                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/admin/users")
                            }
                        >
                            Back
                        </Button>

                        <Button
    variant="contained"
    onClick={async () => {
        try {
            await dispatch(
                updateUser({
                    id,
                    userData: formData,
                })
            ).unwrap();

            navigate("/admin/users");
        } catch (err) {
            console.error(err);
        }
    }}
>
    Save Changes
</Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditUser;