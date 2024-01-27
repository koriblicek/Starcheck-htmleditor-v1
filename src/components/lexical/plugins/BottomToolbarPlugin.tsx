import { Box } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ActionsGroup from './toolbar/ActionsGroup';

const toolbarPluginSx = {
    position: 'fixed',
    right: '17px',
    bottom: '5px',
    zIndex: 2,
};

export default function BottomToolbarPlugin(): JSX.Element {

    const [editor] = useLexicalComposerContext();

    return (
        // <Grid container sx={toolbarPluginSx} columnGap={.5} rowGap={.5} alignItems='center' justifyContent='end'>
        //     <Grid item>
        <Box sx={toolbarPluginSx}>
            <ActionsGroup editor={editor} include={['clear']} />
        </Box>
        //     </Grid>
        // </Grid>

    );
}
