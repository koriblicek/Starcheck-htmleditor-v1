import { Grid } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ButtonsDivider } from './toolbar/ButtonsDivider';
import FormattingTextButtonsGroup from './toolbar/FormattingTextButtonsGroup';
import FormattingElementButtonsGroup from './toolbar/FormattingElementButtonsGroup';
import HistoryGroup from './toolbar/HistoryGroup';
import ActionsGroup from './toolbar/ActionsGroup';
import { ElementTypeSelectionGroup } from './toolbar/ElementTypeSelectionGroup';

const toolbarPluginSx = {
    p: .5,
    borderBottom: '1px lightgray solid',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'white'
};

export default function ToolbarPlugin(): JSX.Element {

    const [editor] = useLexicalComposerContext();

    return (
        <Grid container sx={toolbarPluginSx} columnGap={.5} rowGap={.5} alignItems='center'>
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
                <FormattingTextButtonsGroup editor={editor} include={['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'highlight']} />
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
            <Grid item>
                <ActionsGroup editor={editor} include={['clear']} />
            </Grid>
        </Grid>

    );
}
