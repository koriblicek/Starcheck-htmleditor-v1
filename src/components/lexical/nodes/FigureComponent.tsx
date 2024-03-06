import { $getNodeByKey, KEY_DELETE_COMMAND, type ElementFormatType, type NodeKey, KEY_BACKSPACE_COMMAND, COMMAND_PRIORITY_LOW, $isNodeSelection, $getSelection } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { NewImagePayload, Width } from "src/types";
import { Box } from '@mui/material';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { EditFigureDialog } from './dialogs/EditFigureDialog';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isFigureNode, FigureNode, UpdateFigurePayload } from './FigureNode';
import { ComponentsActionsBar } from '../shared/ComponentsActionsBar';
import { mdiPencil } from '@mdi/js';
import { mdiImageSyncOutline } from '@mdi/js';
import { ICON_SIZE } from 'src/types';
import { NewImageUrlDialog } from '../toolbar/groups/image/NewImageUrlDialog';
import { mergeRegister } from '@lexical/utils';
import Icon from '@mdi/react';

type FigureComponentProps = Readonly<
    {
        className: Readonly<{ base: string; focus: string; }>;
        innerClassName: string;
        format: ElementFormatType | null;
        nodeKey: NodeKey;
        src: string;
        figureClasses: string;
        caption: string;
    }>;


const imageCache = new Set();

function useSuspenseImage(src: string) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
        });
    }
}

function LazyImage({ src, altText, width }: { src: string; altText: string | null; width?: Width; }): JSX.Element {

    useSuspenseImage(src);

    return (
        <img
            src={src}
            alt={altText ? altText : ""}
            width={width}
            className="responsive"
        />
    );
}

export function FigureComponent({ className, format, figureClasses, nodeKey, src, caption }: FigureComponentProps) {

    const [editor] = useLexicalComposerContext();
    const [isSelected] = useLexicalNodeSelection(nodeKey);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isChangeDialogOpen, setIsChangeDialogOpen] = useState<boolean>(false);

    const node = editor.getEditorState().read(() => $getNodeByKey(nodeKey) as FigureNode);

    const handleEditClose = useCallback(() => {
        setIsEditDialogOpen(false);
    }, []);

    const handleEditClick = useCallback(() => {
        setIsEditDialogOpen(true);
    }, []);

    const handleChangeClose = useCallback(() => {
        setIsChangeDialogOpen(false);
    }, []);

    const handleChangeClick = useCallback(() => {
        setIsChangeDialogOpen(true);
    }, []);

    const onDelete = useCallback((payload: KeyboardEvent) => {
        const selection = editor.getEditorState().read(() => {
            return $getSelection();

        });
        if (isSelected && $isNodeSelection(selection)) {
            const event: KeyboardEvent = payload;
            event.preventDefault();
            const node = $getNodeByKey(nodeKey);
            if ($isFigureNode(node)) {
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

    const handleEditUpdate = useCallback((caption: string, figureClasses: string) => {
        const payload: UpdateFigurePayload = { figureClasses, caption };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }

    }, [editor, node]);

    const handleChangeUpdate = useCallback((imageData: NewImagePayload) => {
        const payload: UpdateFigurePayload = { src: imageData.src };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }

    }, [editor, node]);

    const editDialog = useMemo(() => {
        return (
            <EditFigureDialog node={node} open={isEditDialogOpen} onClose={handleEditClose} onUpdate={handleEditUpdate} />
        );
    }, [isEditDialogOpen, handleEditClose, handleEditUpdate, node]);

    const changeDialog = useMemo(() => {
        return (
            <NewImageUrlDialog open={isChangeDialogOpen} onClose={handleChangeClose} onConfirm={handleChangeUpdate} path={node.getSrc()} />
        );
    }, [isChangeDialogOpen, handleChangeClose, handleChangeUpdate, node]);

    return (
        <BlockWithAlignableContents
            className={{ ...className, base: className.base + " " + figureClasses }}
            format={format}
            nodeKey={nodeKey}
        >
            <Box sx={{ position: 'relative', pointerEvents: isSelected ? 'all' : 'none' }}>
                <Suspense fallback={null}>
                    <figure style={{ pointerEvents: 'none' }}>
                        <LazyImage
                            src={src}
                            altText={caption}
                            width="100%"
                        />
                        <figcaption>{caption}</figcaption>
                    </figure>
                    {editDialog}
                    {changeDialog}
                </Suspense>
                {isSelected &&
                    <ComponentsActionsBar label='Figure' actions={[
                        { onButtonClick: handleEditClick, buttonLabel: 'Edit', buttonIcon: <Icon path={mdiPencil} size={ICON_SIZE} /> },
                        { onButtonClick: handleChangeClick, buttonLabel: 'Change', buttonIcon: <Icon path={mdiImageSyncOutline} size={1} /> }
                    ]} />
                }
            </Box>
        </BlockWithAlignableContents>
    );
}
