import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    Paper,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TableRowsIcon from "@mui/icons-material/TableRows";

import {
    getUsers,
    deleteUser,
} from "../../../redux/admin/userSlice";

import UserTable from "../../../components/admin/users/UserTable";
import UserCard from "../../../components/admin/users/UserCard";
import UserSearch from "../../../components/admin/users/UserSearch";
import UserFilter from "../../../components/admin/users/UserFilter";
import UserPagination from "../../../components/admin/users/UserPagination";
import DeleteUserDialog from "../../../components/admin/users/DeleteUserDialog";
import UserSkeleton from "../../../components/admin/users/UserSkeleton";

const Users = () => {
    const dispatch = useDispatch();

  const {
    users = [],
    loading,
    error,
} = useSelector((state) => state.adminUser);



    //---------------------------------------
    // State
    //---------------------------------------

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [viewMode, setViewMode] = useState("table");

    const [page, setPage] = useState(1);

    const [rowsPerPage] = useState(10);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    //---------------------------------------
    // Fetch Users
    //---------------------------------------

useEffect(() => {
    dispatch(getUsers());
}, [dispatch]);

useEffect(() => {
    setPage(1);
}, [search, statusFilter]);

    //---------------------------------------
    // Filter Users
    //---------------------------------------

    const filteredUsers = useMemo(() => {
        let filtered = [...users];

        if (search.trim()) {
            filtered = filtered.filter((user) =>
                user.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.phone
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((user) =>
                statusFilter === "active"
                    ? user.status
                    : !user.status
            );
        }

        return filtered;
    }, [users, search, statusFilter]);

    //---------------------------------------
    // Pagination
    //---------------------------------------

    const totalPages = Math.ceil(
        filteredUsers.length / rowsPerPage
    );

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    //---------------------------------------
    // Delete
    //---------------------------------------

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
        await dispatch(
            deleteUser(selectedUser.id)
        ).unwrap();

        setDeleteDialogOpen(false);
        setSelectedUser(null);
    } catch (error) {
        console.error(
            "Delete user failed:",
            error
        );
    }
};

    //---------------------------------------
    // Loading
    //---------------------------------------

    if (loading) {
        return <UserSkeleton />;
    }

    return (
        <Box p={3}>

            {/* Header */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Customers
                    </Typography>

                    <Typography color="text.secondary">
                        Manage all customers
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled
                >
                    Add Customer
                </Button>
            </Box>

            {/* Error */}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, borderRadius: 3 }}>

                {/* Search */}
<UserSearch
    search={search}
    setSearch={setSearch}
/>

                {/* Filter */}

                <UserFilter
                    value={statusFilter}
                    onChange={setStatusFilter}
                />

                {/* View Toggle */}

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    my={2}
                >
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, value) => {
                            if (value) setViewMode(value);
                        }}
                    >
                        <ToggleButton value="table">
                            <TableRowsIcon />
                        </ToggleButton>

                        <ToggleButton value="grid">
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Table */}
{viewMode === "table" ? (
    <UserTable
        users={paginatedUsers}
        onDelete={handleDeleteClick}
    />
) : (
    <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill,minmax(320px,1fr))"
        gap={3}
    >
        {paginatedUsers.map((user) => (
            <UserCard
                key={user.id}
                user={user}
                onDelete={handleDeleteClick}
            />
        ))}
    </Box>
)}
                

                {/* Pagination */}

                <Box mt={3}>
                  <UserPagination
    currentPage={page}
    totalPages={totalPages}
    totalItems={filteredUsers.length}
    pageSize={rowsPerPage}
    onPageChange={setPage}
/>
                </Box>

            </Paper>

            {/* Delete Dialog */}

            <DeleteUserDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                user={selectedUser}
            />

        </Box>
    );
};

export default Users;