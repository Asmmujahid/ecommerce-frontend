import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    message: "",
    severity: "success",
};

const uiSlice = createSlice({
    name: "ui",

    initialState,

    reducers: {
        showSnackbar: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.severity =
                action.payload.severity || "success";
        },

        hideSnackbar: (state) => {
            state.open = false;
            state.message = "";
        },
    },
});

export const {
    showSnackbar,
    hideSnackbar,
} = uiSlice.actions;

export default uiSlice.reducer;