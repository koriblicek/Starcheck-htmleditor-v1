import { $getNodeByKey, type NodeKey } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { useCallback, useMemo, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DivClearBothNode, UpdateDivClearBothPayload } from './DivClearBothNode';
import { EditDivClearBothDialog } from './dialogs/EditDivClearBothDialog';
import { Box } from '@mui/material';
import { ComponentsActionsBar } from '../shared/ComponentsActionsBar';

type DivClearBothComponentProps = Readonly<
    {
        className: Readonly<{ base: string; focus: string; }>;
        nodeKey: NodeKey;
        divClearBothClasses: string;
    }>;

export function DivClearBothComponent({ className, divClearBothClasses, nodeKey }: DivClearBothComponentProps) {

    const [editor] = useLexicalComposerContext();
    const [isSelected] = useLexicalNodeSelection(nodeKey);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

    const node = editor.getEditorState().read(() => $getNodeByKey(nodeKey) as DivClearBothNode);

    const handleClose = useCallback(() => {
        setIsEditDialogOpen(false);
    }, []);

    const handleEditClick = useCallback(() => {
        setIsEditDialogOpen(true);
    }, []);

    const handleUpdate = useCallback((divClearBothClasses: string) => {
        const payload: UpdateDivClearBothPayload = { divClearBothClasses };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }

    }, [editor, node]);

    const editDialog = useMemo(() => {
        return (
            <EditDivClearBothDialog node={node} open={isEditDialogOpen} onClose={handleClose} onUpdate={handleUpdate} />
        );
    }, [isEditDialogOpen, handleClose, handleUpdate, node]);

    return (
        <Box sx={{ position: 'relative' }}>
            <BlockWithAlignableContents
                className={{ ...className, base: className.base }}
                nodeKey={nodeKey}
            >
                <div className={divClearBothClasses} style={{ pointerEvents: 'none', margin:'10px' }}>&nbsp;
                    
                </div>
                {editDialog}
            </BlockWithAlignableContents>
            {isSelected &&
                <ComponentsActionsBar onEditClicked={handleEditClick} label='Div Clear Both' />
            }
        </Box >
    );
}