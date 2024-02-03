import { Box } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ActionsGroup from './groups/ActionsGroup';

const toolbarSx = {
    position: 'fixed',
    right: '17px',
    bottom: '5px',
    zIndex: 2,
};

export default function BottomToolbarPlugin(): JSX.Element {

    const [editor] = useLexicalComposerContext();

    return (
        <Box sx={toolbarSx}>
            <ActionsGroup editor={editor} include={['preview', 'clear']} />
        </Box>
    );
}
