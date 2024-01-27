import { Grid } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ButtonsDivider from './toolbar/ButtonsDivider';
import ElementTypeSelectionGroup from './toolbar/ElementTypeSelectionGroup';
import FormattingTextButtonsGroup from './toolbar/FormattingTextButtonsGroup';
import FormattingElementButtonsGroup from './toolbar/FormattingElementButtonsGroup';
import HistoryGroup from './toolbar/HistoryGroup';
import IndentationGroup from './toolbar/IndentationGroup';

const toolbarPluginSx = {
    p: .5,
    borderBottom: '1px lightgray solid',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'white',
    overflow: "auto",
    scrollbarWidth: 'thin'
};

export default function TopToolbarPlugin(): JSX.Element {

    const [editor] = useLexicalComposerContext();

    return (
        <Grid container sx={toolbarPluginSx} columnGap={.5} rowGap={.5} alignItems='center' direction='row' wrap='nowrap'>
            <Grid item>
                <HistoryGroup editor={editor} include={['undo', 'redo']} />
            </Grid>
            <Grid item>
                <ButtonsDivider />
            </Grid>
            <Grid item>
                <ElementTypeSelectionGroup editor={editor} include={['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote']} />
            </Grid>
            <Grid item>
                <ButtonsDivider />
            </Grid>
            <Grid item>
                <FormattingTextButtonsGroup editor={editor} buttons={['bold', 'italic', 'underline', 'clear_text_format']} grouppedButtons={['strikethrough', 'code', 'subscript', 'superscript', 'highlight']} />
            </Grid>
            <Grid item>
                <ButtonsDivider />
            </Grid>
            <Grid item>
                <IndentationGroup editor={editor} include={['outdent', 'indent']} />
            </Grid>
            <Grid item>
                <ButtonsDivider />
            </Grid>
            <Grid item>
                <FormattingElementButtonsGroup editor={editor} include={['left', 'center', 'right', 'justify', '']} />
            </Grid>
            <Grid item>
                <ButtonsDivider />
            </Grid>
        </Grid>
    );
}
