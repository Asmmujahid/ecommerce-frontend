import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Chip,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { deleteUser } from "../../../redux/admin/userSlice";
import UserStatusSwitch from "./UserStatusSwitch";

const UserCard = ({ user, onDelete }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //------------------------------------------------------
    // View Customer
    //------------------------------------------------------

   const handleView = () => {
    navigate(`/admin/users/view/${user.id}`);
};

    const handleEdit = () => {
    navigate(`/admin/users/edit/${user.id}`);
};

    //------------------------------------------------------
    // Delete Customer
    //------------------------------------------------------

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${user.name}"?`
        );

        if (!confirmDelete) return;

        try {
            await dispatch(deleteUser(user.id)).unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    //------------------------------------------------------
    // UI
    //------------------------------------------------------

    return (
        <Card
            elevation={3}
            className="rounded-xl hover:shadow-lg transition-all duration-300"
        >
            <CardContent>

                {/* Avatar */}

                <div className="flex justify-center mb-4">

                    <Avatar
                        src={user.avatar || ""}
                        alt={user.name}
                        sx={{
                            width: 80,
                            height: 80,
                            fontSize: 30,
                        }}
                    >
                        {user.name?.charAt(0).toUpperCase()}
                    </Avatar>

                </div>

                {/* Name */}

                <Typography
                    variant="h6"
                    align="center"
                    fontWeight="bold"
                >
                    {user.name}
                </Typography>

                {/* Email */}

                <div className="flex items-center gap-2 mt-4">

                    <EmailIcon
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                    >
                        {user.email}
                    </Typography>

                </div>

                {/* Phone */}

                <div className="flex items-center gap-2 mt-2">

                    <PhoneIcon
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {user.phone || "N/A"}
                    </Typography>

                </div>

                {/* Created Date */}

                <div className="flex items-center gap-2 mt-2">

                    <CalendarMonthIcon
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {user.created_at
                            ? new Date(
                                  user.created_at
                              ).toLocaleDateString()
                            : "-"}
                    </Typography>

                </div>

                {/* Status */}

                <div className="flex justify-between items-center mt-6">

                    <Chip
                        label={
                            user.status
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            user.status
                                ? "success"
                                : "error"
                        }
                        size="small"
                    />

                    <UserStatusSwitch user={user} />

                </div>

                {/* Actions */}

               <div className="flex justify-end gap-2 mt-6">

    <Tooltip title="View Customer">
        <IconButton
            color="primary"
            onClick={handleView}
        >
            <VisibilityIcon />
        </IconButton>
    </Tooltip>

    <Tooltip title="Edit Customer">
        <IconButton
            color="warning"
            onClick={handleEdit}
        >
            <EditIcon />
        </IconButton>
    </Tooltip>

    <Tooltip title="Delete Customer">
        <IconButton
            color="error"
            onClick={() => onDelete?.(user)}
        >
            <DeleteIcon />
        </IconButton>
    </Tooltip>

</div>

            </CardContent>
        </Card>
    );
};

export default UserCard;