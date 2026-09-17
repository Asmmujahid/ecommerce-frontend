// src/components/customer/profile/ProfileCard.jsx

import {
    Avatar,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";

// =====================================================
// SAFE DISPLAY VALUE
// =====================================================

const getDisplayValue = (
    value,
    fallback = "-"
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    // String / Number / Boolean
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    // Array
    if (Array.isArray(value)) {
        return value
            .map((item) =>
                getDisplayValue(item, "")
            )
            .filter(Boolean)
            .join(", ");
    }

    // Object
    if (typeof value === "object") {
        /*
         * Handle common Laravel/API formats.
         */

        if (
            typeof value.name === "string"
        ) {
            return value.name;
        }

        if (
            typeof value.label === "string"
        ) {
            return value.label;
        }

        if (
            typeof value.value === "string" ||
            typeof value.value === "number"
        ) {
            return String(value.value);
        }

        if (
            typeof value.status === "string"
        ) {
            return value.status;
        }

        if (
            typeof value.title === "string"
        ) {
            return value.title;
        }

        /*
         * Last fallback.
         */

        try {
            return JSON.stringify(value);
        } catch {
            return fallback;
        }
    }

    return fallback;
};

// =====================================================
// FORMAT STATUS
// =====================================================

const formatStatus = (status) => {
    const value = getDisplayValue(
        status,
        "Active"
    );

    if (!value) {
        return "Active";
    }

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};

// =====================================================
// COMPONENT
// =====================================================

const ProfileCard = ({
    profile,
    onChangePassword,
}) => {
    /*
     * Do not render the card until
     * profile data is available.
     */

    if (!profile) {
        return null;
    }

    // =================================================
    // SAFE VALUES
    // =================================================

    const name = getDisplayValue(
        profile.name,
        "User"
    );

    const email = getDisplayValue(
        profile.email,
        "-"
    );

    const phone = getDisplayValue(
        profile.phone,
        "-"
    );

    const status = formatStatus(
        profile.status
    );

    /*
     * Avatar can sometimes be null,
     * object, or string.
     */

    const avatar = 
        typeof profile.avatar === "string"
            ? profile.avatar
            : "";

    const firstLetter =
        name
            ?.charAt(0)
            ?.toUpperCase() || "U";

    // =================================================
    // RENDER
    // =================================================

    return (
        <Card
            sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow:
                    "0 2px 10px rgba(0,0,0,0.06)",
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2.5,
                            sm: 3,
                        },
                    },
                }}
            >
                <Stack
                    alignItems="center"
                    spacing={2}
                >
                    {/* =================================================
                        AVATAR
                    ================================================= */}

                    <Avatar
                        src={
                            avatar || undefined
                        }
                        alt={name}
                        sx={{
                            width: 110,
                            height: 110,
                            fontSize: 40,
                            fontWeight: 600,
                        }}
                    >
                        {firstLetter}
                    </Avatar>

                    {/* =================================================
                        NAME
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        textAlign="center"
                    >
                        {name}
                    </Typography>

                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{
                            wordBreak:
                                "break-word",
                        }}
                    >
                        {email}
                    </Typography>

                    <Divider
                        sx={{
                            width: "100%",
                            my: 1,
                        }}
                    />

                    {/* =================================================
                        ACCOUNT STATUS
                    ================================================= */}

                    <Stack
                        spacing={0.5}
                        width="100%"
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Account Status
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {status}
                        </Typography>
                    </Stack>

                    {/* =================================================
                        PHONE
                    ================================================= */}

                    <Stack
                        spacing={0.5}
                        width="100%"
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Phone
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                                wordBreak:
                                    "break-word",
                            }}
                        >
                            {phone}
                        </Typography>
                    </Stack>

                    {/* =================================================
                        CHANGE PASSWORD
                    ================================================= */}

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={
                            <LockIcon />
                        }
                        onClick={
                            onChangePassword
                        }
                        sx={{
                            mt: 1,
                        }}
                    >
                        Change Password
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;