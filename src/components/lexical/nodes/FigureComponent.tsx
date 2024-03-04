import { $getNodeByKey, type ElementFormatType, type NodeKey } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { Width } from "src/types";
import { IconButton } from '@mui/material';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mdiPencilOutline } from '@mdi/js';
import { EditFigureDialog } from './dialogs/EditFigureDialog';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import Icon from '@mdi/react';
import { FigureNode, UpdateFigurePayload } from './FigureNode';

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

    const node = editor.getEditorState().read(() => $getNodeByKey(nodeKey) as FigureNode);

    const handleClose = useCallback(() => {
        setIsEditDialogOpen(false);
    }, []);

    const handleUpdate = useCallback((caption: string, figureClasses: string) => {
        const payload: UpdateFigurePayload = { figureClasses, caption };
        if (node) {
            editor.update(() => {
                node.update(payload);
            });
        }

    }, [editor, node]);

    const editDialog = useMemo(() => {
        return (
            <EditFigureDialog node={node} open={isEditDialogOpen} onClose={handleClose} onUpdate={handleUpdate} />
        );
    }, [isEditDialogOpen, handleClose, handleUpdate, node]);

    return (
        <BlockWithAlignableContents
            className={{ ...className, base: className.base + " " + figureClasses }}
            format={format}
            nodeKey={nodeKey}
        >
            <Suspense fallback={null}>
                <figure className={figureClasses} style={{ pointerEvents: 'none' }}>
                    <IconButton
                        color="primary"
                        sx={{
                            position: 'relative',
                            m: 1,
                            display: isSelected ? "block" : "none",
                            pointerEvents: 'auto',
                            backgroundColor: "white",
                            "&:hover": { backgroundColor: "white" },
                            "&:focus": { backgroundColor: "white" }
                        }}
                        size='small'
                        onClick={(e) => {
                            setIsEditDialogOpen(true);
                            e.stopPropagation();
                        }}
                    >
                        <Icon path={mdiPencilOutline} size={1} />
                    </IconButton>
                    <LazyImage
                        src={src}
                        altText={caption}
                        width="100%"
                    />
                    <figcaption>{caption}</figcaption>
                </figure>
                {editDialog}
            </Suspense>
        </BlockWithAlignableContents>
    );
}