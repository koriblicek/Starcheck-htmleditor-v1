import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createEmbedVideoNode, EmbedVideoNode, EmbedVideoPayload } from '../nodes/EmbedVideoNode';

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_EMBED_VIDEO_COMMAND: LexicalCommand<EmbedVideoPayload> = createCommand('INSERT_EMBED_VIDEO_COMMAND');

export default function EmbedVideoPlugin(): JSX.Element | null {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([EmbedVideoNode])) {
            throw new Error('EmbedVideoPlugin: EmbedVideoNode not registered on editor');
        }
        return editor.registerCommand<EmbedVideoPayload>(
            INSERT_EMBED_VIDEO_COMMAND,
            (payload) => {
                const embedVideoNode = $createEmbedVideoNode(payload);
                $insertNodeToNearestRoot(embedVideoNode);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);
    return null;
}