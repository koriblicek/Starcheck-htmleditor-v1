import styled from "@emotion/styled";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export const MuiContentEditable = styled(ContentEditable)({
  position: 'relative',
  padding: '5px 10px',
  margin: '10px',
  outline: '1px lightgray dashed',
  transition: 'outline .2s',
  // maxHeight: '400px',
  // overflowY: 'auto',
  "&:focus": {
    outline: '1px gray dashed',
  }

});

