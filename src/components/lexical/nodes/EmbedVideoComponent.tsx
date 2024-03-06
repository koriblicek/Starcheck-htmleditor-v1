import { $getNodeByKey, $getSelection, $isNodeSelection, KEY_DELETE_COMMAND, type ElementFormatType, type NodeKey, KEY_BACKSPACE_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { Suspense, useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { $isEmbedVideoNode } from './EmbedVideoNode';
import { mergeRegister } from '@lexical/utils';

type EmbedVideoComponentProps = Readonly<
    {
        className: Readonly<{ base: string; focus: string; }>;
        format: ElementFormatType | null;
        nodeKey: NodeKey;
        videoUrl: string;
        posterUrl: string;
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

function LazyImage({ posterUrl }: { posterUrl: string; }): JSX.Element {

    useSuspenseImage(posterUrl);

    return (
        <img
            src={posterUrl}
            alt=""
            style={{
                height: 'auto',
                width: '100%',
            }}
        />
    );
}

export function EmbedVideoComponent({ className, format, nodeKey, videoUrl, posterUrl }: EmbedVideoComponentProps) {
    const [editor] = useLexicalComposerContext();
    const [isSelected] = useLexicalNodeSelection(nodeKey);

    const onDelete = useCallback((payload: KeyboardEvent) => {
        const selection = editor.getEditorState().read(() => {
            return $getSelection();

        });
        if (isSelected && $isNodeSelection(selection)) {
            const event: KeyboardEvent = payload;
            event.preventDefault();
            const node = $getNodeByKey(nodeKey);
            if ($isEmbedVideoNode(node)) {
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


    return (
        <BlockWithAlignableContents
            className={className}
            format={format}
            nodeKey={nodeKey}
        >
            <Suspense fallback={null}>
                <a href={videoUrl} data-poster={posterUrl} style={{ pointerEvents: 'none' }}>
                    <LazyImage posterUrl={posterUrl} />
                </a>
            </Suspense>
        </BlockWithAlignableContents>
    );
}