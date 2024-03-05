import { createTheme } from "@mui/material";

// const font = "'Roboto', sans-serif";

// const mediaQueryTheme = createTheme();

const theme = createTheme({
    // palette: {
    //     primary: {
    //         main: "#1c3e50",
    //     },
    //     secondary: {
    //         main: "#fa7930ff",
    //         contrastText: "white",
    //     },
    //     background: {
    //         default: "#f8f8f8",
    //     }
    // },
    typography: {
        // fontFamily: "sans-serif",
        button: {
            fontSize: ".85em",
        }
    },
    // palette: {
    //     primary: #009900
    //   },
});

export default theme;