import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

const richTextWrapperSx = {
    position: 'relative',
    overflow: 'auto',
    resize: 'vertical'
};

export default function RichTextWrapper({ children }: PropsWithChildren) {
    return (
        <Box sx={richTextWrapperSx}>
            {children}
        </Box>
    );
}
