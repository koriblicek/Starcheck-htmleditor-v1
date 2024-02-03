import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createYouTubeNode, YouTubeNode } from '../nodes/YouTubeNode';

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand('INSERT_YOUTUBE_COMMAND');

export default function YouTubePlugin(): JSX.Element | null {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([YouTubeNode])) {
            throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
        }
        return editor.registerCommand<string>(
            INSERT_YOUTUBE_COMMAND,
            (payload) => {
                console.log(payload);
                const youTubeNode = $createYouTubeNode(payload);
                $insertNodeToNearestRoot(youTubeNode);

                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);
    return null;
}