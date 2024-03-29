import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { EnumUiTemplates, IAppInputData, perexBrief, setupDefault, setupDevCondensed } from "./types";
import Editor from "./components/lexical/Editor";
import theme from "./components/ui/theme";

interface IAppProps {
  inputData: IAppInputData;
}

function App({ inputData }: IAppProps) {
  let setup = setupDefault;

  switch (inputData.dataUiTemplate) {
    case EnumUiTemplates.DEVELOPER_CONDENSED:
      setup = setupDevCondensed;
      break;
    case EnumUiTemplates.PEREX_BRIEF:
      setup = perexBrief;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Editor toolbarsSetup={setup} inputData={inputData} />
    </ThemeProvider>
  );
}

export default App;
