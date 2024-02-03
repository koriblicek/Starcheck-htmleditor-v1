import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { EditorToolbarsSetup } from "./types";
import Editor from "./components/lexical/Editor";
import theme from "./components/ui/theme";

const setup: EditorToolbarsSetup = {
  top: [
    {
      historyGroup: {
        startDivider: false,
        buttons: ['undo', 'redo'],
        groupedButtons: [],
        endDivider: true
      },
      fontSelection: {
        startDivider: false,
        fontsFamilyList: [
          { name: "Default font", family: '' },
          { name: "Arial", family: '"Arial", "Helvetica Neue", "Helvetica", "sans-serif"' },
          { name: "Calibri", family: '"Calibri", "Candara", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif"' },
          { name: "Courier New", family: '"Courier New", "Courier", "Lucida Sans Typewriter", "Lucida", "Typewriter", "monospace"' },
          { name: "Verdana", family: '"Verdana", "Geneva", "sans-serif"' }
        ],
        fixedWidth: '100px',
        endDivider: false
      },
      fontSizeSelection: {
        startDivider: false,
        fontSizeList: [
          [8, "8px"],
          [9, "9px"],
          [10, "10px"],
          [11, "11px"],
          [12, "12px"],
          [14, "14px"],
          [16, "16px"],
          [18, "18px"],
          [20, "20px"],
          [22, "22px"],
          [24, "24px"],
          [26, "26px"],
          [28, "28px"],
          [36, "36px"],
          [48, "48px"],
          [72, "72px"]
        ],
        fixedWidth: '25px',
        endDivider: true
      },
      textColorSelection: {
        startDivider: false,
        endDivider: false
      },
      textBackgroundColorSelection: {
        startDivider: false,
        endDivider: true
      },
      textFormattingGroup: {
        startDivider: false,
        buttons: ['bold', 'italic', 'underline', 'code', 'clear_text_formatting'],
        groupedButtons: ['strikethrough', 'subscript', 'superscript', 'highlight'],
        endDivider: true
      },
      linkButton: {
        startDivider: false,
        endDivider: false
      },
      imageSelection: {
        startDivider: false,
        endDivider: false
      },
      youTubeButton: {
        startDivider: false,
        endDivider: false
      }
    },
    {
      elementTypeGroup: {
        startDivider: false,
        buttons: ['bullet', 'number', 'h1', 'h2', 'h3', 'quote'],
        groupedButtons: ['paragraph', 'h4', 'h5', 'h6', 'check'],
        fixedWidth: '160px',
        endDivider: true
      },
      elementIndentationGroup: {
        startDivider: false,
        buttons: ['indent', 'outdent'],
        groupedButtons: [],
        endDivider: true
      },
      elementAlignmentGroup: {
        startDivider: false,
        buttons: ['left', 'center', 'right', 'justify', 'clear_alignment'],
        groupedButtons: [],
        endDivider: false
      }
    }
  ]
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Editor toolbarsSetup={setup} />
    </ThemeProvider>
  );
}

export default App;
