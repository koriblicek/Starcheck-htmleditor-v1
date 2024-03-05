import { $getNodeByKey, type NodeKey } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { useCallback, useMemo, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HorizontalRuleNode, UpdateHorizontalRulePayload } from './HorizontalRuleNode';
import { EditHorizontalRuleDialog } from './dialogs/EditHorizontalRuleDialog';
import { Box } from '@mui/material';
import { ComponentsActionsBar } from '../shared/ComponentsActionsBar';

type HorizontalRuleComponentProps = Readonly<
    {
        className: Readonly<{ base: string; focus: string; }>;
        nodeKey: NodeKey;
        horizontalRuleClasses: string;
    }>;

export function HorizontalRuleComponent({ className, horizontalRuleClasses, nodeKey }: HorizontalRuleComponentProps) {

    const [editor] = useLexicalComposerContext();
    const [isSelected] = useLexicalNodeSelection(nodeKey);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

    const node = editor.getEditorState().read(() => $getNodeByKey(nodeKey) as HorizontalRuleNode);

    const handleClose = useCallback(() => {
        setIsEditDialogOpen(false);
    }, []);

    const handleEditClick = useCallback(() => {
        setIsEditDialogOpen(true);
    }, []);

    const handleUpdate = useCallback((horizontalRuleClasses: string) => {
        const payload: UpdateHorizontalRulePayload = { horizontalRuleClasses };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }

    }, [editor, node]);

    const editDialog = useMemo(() => {
        return (
            <EditHorizontalRuleDialog node={node} open={isEditDialogOpen} onClose={handleClose} onUpdate={handleUpdate} />
        );
    }, [isEditDialogOpen, handleClose, handleUpdate, node]);

    return (
        <Box sx={{ position: 'relative' }}>
            <BlockWithAlignableContents
                className={{ ...className, base: className.base }}
                nodeKey={nodeKey}
            >
                <div style={{ padding: '5px', pointerEvents: 'none' }}>
                    <hr className={horizontalRuleClasses} style={{ pointerEvents: 'none', margin:0 }} />
                </div>
                {editDialog}
            </BlockWithAlignableContents>
            {isSelected &&
                <ComponentsActionsBar onEditClicked={handleEditClick} label='Horizontal Rule' />
            }
        </Box >
    );
}