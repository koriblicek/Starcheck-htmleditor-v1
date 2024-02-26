import { type ElementFormatType, type NodeKey } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { Float, Height, Width } from "src/types";
import { IconButton } from '@mui/material';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import Icon from '@mdi/react';
import { mdiPencilOutline } from '@mdi/js';
import { EditFigureDialog } from './dialogs/EditFigureDialog';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

type FigureComponentProps = Readonly<
    {
        className: Readonly<{ base: string; focus: string; }>;
        innerClassName: string;
        format: ElementFormatType | null;
        nodeKey: NodeKey;
        src: string;
        altText: string;
        caption: string;
        width: Width;
        height: Height;
        float: Float;
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

function LazyImage({ src, altText, width, height }: { src: string; altText: string | null; height?: Height; width?: Width; }): JSX.Element {

    useSuspenseImage(src);

    return (
        <img
            src={src}
            alt={altText ? altText : ""}
            style={{
                height: `${height}`,
                width: `${width}`,
            }}
        />
    );
}

export function FigureComponent({ className, innerClassName, format, nodeKey, src, altText, caption, width, height, float }: FigureComponentProps) {

    const [editor] = useLexicalComposerContext();
    const [isSelected] = useLexicalNodeSelection(nodeKey);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

    const onClose = useCallback(() => {
        setIsEditDialogOpen(false);
    }, []);

    const editDialog = useMemo(() => {
        return (
            <EditFigureDialog editor={editor} nodeKey={nodeKey} open={isEditDialogOpen} onClose={onClose} />
        );
    }, [isEditDialogOpen, editor, nodeKey, onClose]);

    return (
        <BlockWithAlignableContents
            className={className}
            format={format}
            nodeKey={nodeKey}
        >
            <Suspense fallback={null}>
                <figure className={innerClassName} style={{ display: 'inline-block', float, maxWidth: '100%', width, height, pointerEvents: 'none', position: 'relative' }}>
                    <IconButton
                        color="primary"
                        sx={{
                            position: 'absolute',
                            m: 1,
                            visibility: isSelected ? "visible" : "hidden",
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
                        altText={altText}
                        width='100%'
                        height='100%'
                    />
                    {/* <img src={src} alt={altText} style={{ width, height, float }} /> */}
                    <figcaption>{caption}</figcaption>
                </figure>
                {editDialog}
            </Suspense>
        </BlockWithAlignableContents>
    );
}