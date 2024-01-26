import styled from "@emotion/styled";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export const MuiContentEditable = styled(ContentEditable)({
    position: 'relative',
    padding: '5px 10px',
    // maxHeight: '400px',
    // overflowY: 'auto',
    outline: "none",
    width: "100%"
});

