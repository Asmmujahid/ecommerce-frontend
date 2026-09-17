import api from "../../api/axios";

/*
|--------------------------------------------------------------------------
| Customer Profile Service
|--------------------------------------------------------------------------
*/

const ProfileService = {
    /*
    |--------------------------------------------------------------------------
    | Get Customer Profile
    |--------------------------------------------------------------------------
    | GET /api/customer/profile
    */

    async getProfile() {
        try {
            const response = await api.get(
                "/customer/profile"
            );

            console.log(
                "GET PROFILE RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "GET PROFILE ERROR:",
                error
            );

            throw {
                message:
                    error?.response?.data?.message ||
                    "Customer profile could not be loaded.",

                errors:
                    error?.response?.data?.errors || {},

                status:
                    error?.response?.status || null,
            };
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Update Customer Profile
    |--------------------------------------------------------------------------
    | PUT /api/customer/profile
    */

    async updateProfile(profileData) {
        try {
            console.log(
                "UPDATE PROFILE DATA:",
                profileData
            );

            const response = await api.put(
                "/customer/profile",
                profileData
            );

            console.log(
                "UPDATE PROFILE RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "UPDATE PROFILE ERROR:",
                error
            );

            throw {
                message:
                    error?.response?.data?.message ||
                    "Failed to update profile.",

                errors:
                    error?.response?.data?.errors || {},

                status:
                    error?.response?.status || null,
            };
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    | POST /api/customer/change-password
    */

    async changePassword(passwordData) {
        try {
            const response = await api.post(
                "/customer/change-password",
                passwordData
            );

            return response.data;
        } catch (error) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                error
            );

            throw {
                message:
                    error?.response?.data?.message ||
                    "Failed to change password.",

                errors:
                    error?.response?.data?.errors || {},

                status:
                    error?.response?.status || null,
            };
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Delete Account
    |--------------------------------------------------------------------------
    | DELETE /api/customer/profile
    */

    async deleteAccount() {
        try {
            const response = await api.delete(
                "/customer/profile"
            );

            return response.data;
        } catch (error) {
            console.error(
                "DELETE ACCOUNT ERROR:",
                error
            );

            throw {
                message:
                    error?.response?.data?.message ||
                    "Failed to delete account.",

                errors:
                    error?.response?.data?.errors || {},

                status:
                    error?.response?.status || null,
            };
        }
    },
};

export default ProfileService;