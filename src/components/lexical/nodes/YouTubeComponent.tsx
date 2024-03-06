import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { KEY_DELETE_COMMAND, type ElementFormatType, type NodeKey, $getSelection, $getNodeByKey, KEY_BACKSPACE_COMMAND, COMMAND_PRIORITY_LOW, $isNodeSelection } from 'lexical';
import { useCallback, useEffect } from "react";
import { mergeRegister } from '@lexical/utils';
import { $isYouTubeNode } from "./YouTubeNode";

type YouTubeComponentProps = Readonly<{ className: Readonly<{ base: string; focus: string; }>; format: ElementFormatType | null; nodeKey: NodeKey; videoID: string; }>;

export default function YouTubeComponent({ className, format, nodeKey, videoID }: YouTubeComponentProps) {
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
            if ($isYouTubeNode(node)) {
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
            nodeKey={nodeKey}>
            <iframe
                style={{ width: '100%', aspectRatio: '16/9', pointerEvents: 'none' }}
                src={`https://www.youtube-nocookie.com/embed/${videoID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}
                title="YouTube video"
            />
        </BlockWithAlignableContents>
    );
}