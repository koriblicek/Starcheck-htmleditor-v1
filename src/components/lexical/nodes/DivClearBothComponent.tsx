import { $getNodeByKey, $getSelection, $isNodeSelection, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND, type NodeKey } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDivClearBothNode, DivClearBothNode, UpdateDivClearBothPayload } from './DivClearBothNode';
import { EditDivClearBothDialog } from './dialogs/EditDivClearBothDialog';
import { Box } from '@mui/material';
import { ComponentsActionsBar } from '../shared/ComponentsActionsBar';
import { mdiPencil } from '@mdi/js';
import { ICON_SIZE } from 'src/types';
import { mergeRegister } from '@lexical/utils';
import Icon from '@mdi/react';

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

    const onDelete = useCallback((payload: KeyboardEvent) => {
        const selection = editor.getEditorState().read(() => {
            return $getSelection();

        });
        if (isSelected && $isNodeSelection(selection)) {
            const event: KeyboardEvent = payload;
            event.preventDefault();
            const node = $getNodeByKey(nodeKey);
            if ($isDivClearBothNode(node)) {
                node.remove();
                return true;
            }
        }
        return false;

    }, [isSelected, nodeKey, editor]);

    useEffect(() => {
        // let isMounted = true;
        const unregister = mergeRegister(
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                onDelete,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                onDelete,
                COMMAND_PRIORITY_LOW,
            )
        );
        return () => {
            // isMounted = false;
            unregister();
        };
    }, [editor, onDelete]);

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
                <div className={divClearBothClasses} style={{ pointerEvents: 'none', margin: '10px' }}>&nbsp;

                </div>
                {editDialog}
            </BlockWithAlignableContents>
            {isSelected &&
                <ComponentsActionsBar label='Div Clear Both' actions={[{ onButtonClick: handleEditClick, buttonLabel: 'Edit', buttonIcon: <Icon path={mdiPencil} size={ICON_SIZE} /> }]} />
            }
        </Box >
    );
}