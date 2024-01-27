import { createTheme } from "@mui/material";

// const font = "'Roboto', sans-serif";

// const mediaQueryTheme = createTheme();

const theme = createTheme({
    palette: {
        primary: {
            main: "#1c3e50",
        },
        secondary: {
            main: "#fa7930ff",
            contrastText: "white",
        },
        background: {
            default: "#f8f8f8",
        },
        // colors: {
        //     darkblue: "#364570ff",
        //     lightgreen: "#9cbec6ff",
        // },
    },
    typography: {
        // fontFamily: font,
        button: {
            fontSize: ".8em",
        }
    },
});

export default theme;