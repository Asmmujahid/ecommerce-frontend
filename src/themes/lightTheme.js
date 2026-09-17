// src/themes/lightTheme.js

import { createTheme } from "@mui/material/styles";

import { lightPalette } from "./palette";
import typography from "./typography";
import shadows from "./shadows";
import components from "./components";

const lightTheme = createTheme({
    palette: lightPalette,

    typography,

    shadows,

    shape: {
        borderRadius: 12,
    },

    spacing: 8,

    components,
});

export default lightTheme;