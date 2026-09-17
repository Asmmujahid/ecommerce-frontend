import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "../../Services/admin/categoryService";

// Get All Categories
export const getCategories = createAsyncThunk(
    "adminCategory/getCategories",
    async (_, thunkAPI) => {
        try {
            return await categoryService.getCategories();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch categories"
            );
        }
    }
);

// Get Single Category
export const getCategory = createAsyncThunk(
    "adminCategory/getCategory",
    async (id, thunkAPI) => {
        try {
            return await categoryService.getCategory(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch category"
            );
        }
    }
);

// Create Category
export const createCategory = createAsyncThunk(
    "adminCategory/createCategory",
    async (categoryData, thunkAPI) => {
        try {
            return await categoryService.createCategory(categoryData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create category"
            );
        }
    }
);

// Update Category
export const updateCategory = createAsyncThunk(
    "adminCategory/updateCategory",
    async ({ id, categoryData }, thunkAPI) => {
        try {
            return await categoryService.updateCategory({
                id,
                categoryData,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update category"
            );
        }
    }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
    "adminCategory/deleteCategory",
    async (id, thunkAPI) => {
        try {
            await categoryService.deleteCategory(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete category"
            );
        }
    }
);

const initialState = {
    categories: [],
    category: null,

    loading: false,
    success: false,
    error: null,
};

const categorySlice = createSlice({
    name: "adminCategory",
    initialState,

    reducers: {
        resetCategoryState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.category = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Get Categories
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
    state.loading = false;
    state.categories = action.payload.data;
})
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Category
            .addCase(getCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
  .addCase(getCategory.fulfilled, (state, action) => {
    state.loading = false;
    state.category = action.payload.data;
})
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Category
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories.unshift(action.payload.data);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Category
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.categories = state.categories.map((category) =>
                    category.id === action.payload.data.id
                        ? action.payload.data
                        : category
                );

                state.category = action.payload.data;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Category
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.categories = state.categories.filter(
                    (category) => category.id !== action.payload
                );
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCategoryState } = categorySlice.actions;

export default categorySlice.reducer;