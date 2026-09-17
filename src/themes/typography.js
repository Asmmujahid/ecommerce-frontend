// src/themes/typography.js

const typography = {
    fontFamily: [
        "Poppins",
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
    ].join(","),

    fontSize: 14,

    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
        fontSize: "3.5rem",
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "-0.03em",
    },

    h2: {
        fontSize: "3rem",
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
    },

    h3: {
        fontSize: "2.5rem",
        fontWeight: 700,
        lineHeight: 1.3,
    },

    h4: {
        fontSize: "2rem",
        fontWeight: 700,
        lineHeight: 1.35,
    },

    h5: {
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
    },

    h6: {
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.5,
    },

    subtitle1: {
        fontSize: "1.125rem",
        fontWeight: 500,
        lineHeight: 1.5,
    },

    subtitle2: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.5,
    },

    body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.7,
    },

    body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.6,
    },

    button: {
        fontSize: "0.95rem",
        fontWeight: 600,
        textTransform: "none",
        letterSpacing: "0.3px",
    },

    caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.4,
        color: "#64748b",
    },

    overline: {
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
};

export default typography;