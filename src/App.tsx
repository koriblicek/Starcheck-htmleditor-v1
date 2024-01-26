import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import Editor from "./components/lexical/Editor";
import theme from "./components/ui/theme";

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Editor />
    </ThemeProvider>
  );
}

export default App;
