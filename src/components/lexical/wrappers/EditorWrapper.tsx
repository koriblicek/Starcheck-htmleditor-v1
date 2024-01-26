import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

const editorWrapperSx = {
    position: 'relative',
    margin: '6px',
    borderRadius: '6px',
    backgroundColor: 'white',
    filter: 'drop-shadow(2px 2px 4px #d8d8d8)'
};

export default function EditorWrapper({ children }: PropsWithChildren) {
    return (
        <Box sx={editorWrapperSx}>
            {children}
        </Box>
    );
}
