// src/themes/darkTheme.js

import { createTheme } from "@mui/material/styles";

import { darkPalette } from "./palette";
import typography from "./typography";
import shadows from "./shadows";
import components from "./components";

const darkTheme = createTheme({
    palette: darkPalette,

    typography,

    shadows,

    shape: {
        borderRadius: 12,
    },

    spacing: 8,

    components,
});

export default darkTheme;